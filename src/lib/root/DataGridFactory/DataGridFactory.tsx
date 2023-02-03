import { throttle } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import EmptyDataGrid from "../../components/ui/EmptyDataGrid/EmptyDataGrid";
import LoadingOverlay from "../../components/ui/LoadingOverlay/LoadingOverlay";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton/LoadingSkeleton";
import { OptionsMenu } from "../../components/ui/OptionsMenu/OptionsMenu";
import { useDataGridStaticContext } from "../../context/DataGridStaticContext";
import useActionsMenuFactory from "../../logic/tools/actions-menu-factory";
import { DataGridFactoryProps } from "../../types/Elements";
import { cs } from "../../utils/ConcatStyles";
import Body from "../Body/Body";
import ColumnLayout from "../ColumnLayout/ColumnLayout";
import ColumnResizingOverlay from "../ColumnResizingOverlay/ColumnResizingOverlay";
import Footer from "../Footer/Footer";
import HeaderLayout from "../HeaderLayout/HeaderLayout";
import HeaderWrapper, { HeaderWrapperRef } from "../HeaderWrapper/HeaderWrapper";
import List from "../List/List";
import ScrollContainer from "../ScrollContainer/ScrollContainer";
import Scroller from "../Scroller/Scroller";
import ViewContainer from "../ViewContainer/ViewContainer";
import "./DataGridFactory.css";

function DataGrid<DataType>({
  theme,
  tp,
  tableTools,
  dataTools,
  pinnedColumns,
  totalColumnsWidth,
  columnsInUse,
  initiateColumns,
  children,
  displayDataActionsMenu,
  displayHeaderActionsMenu,
  filterFnsMenu,
  ...props
}: DataGridFactoryProps<DataType>) {
  const { dimensions, virtualizationEnabled, striped } = useDataGridStaticContext();

  const dataGridRef = useRef<HTMLDivElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const headerWrapperRef = useRef<HeaderWrapperRef | null>(null);
  const viewContainerRef = useRef<HTMLDivElement | null>(null);

  const [layoutDimensions, setLayoutDimensions] = useState<{
    containerWidth: number;
    containerHeight: number;
  }>({
    containerWidth: 0,
    containerHeight: 0,
  });
  const [topScrollPosition, setTopScrollPosition] = useState<number>(0);

  const containerHeight = useMemo(
    () =>
      layoutDimensions.containerHeight -
      (dimensions.defaultHeadRowHeight + dimensions.defaultHeaderFilterHeight + dimensions.defaultFooterHeight),
    [
      layoutDimensions.containerHeight,
      dimensions.defaultFooterHeight,
      dimensions.defaultHeadRowHeight,
      dimensions.defaultHeaderFilterHeight,
    ]
  );

  function onWindowResize() {
    if (dataGridRef.current?.clientHeight && dataGridRef.current.clientWidth) {
      setLayoutDimensions({
        containerHeight: dataGridRef.current.clientHeight,
        containerWidth:
          dataGridRef.current.clientWidth -
          (pinnedColumns?.totalWidth ?? 0) -
          // padding-left of expand width
          10 -
          // padding-left ::before
          20 -
          // vertical scrollbar-width),
          dimensions.defaultScrollbarWidth,
      });
    }
  }

  const updateScrollPositionY = useMemo(() => throttle((top: number) => setTopScrollPosition(top), 50, { leading: false }), []);

  const verticalScrollbarWidth = useMemo(
    () => {
      return scrollerRef.current?.scrollWidth! > scrollerRef.current?.clientWidth! &&
        scrollerRef.current?.scrollHeight! > scrollerRef.current?.clientHeight!
        ? dimensions.defaultScrollbarWidth
        : 0;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scrollerRef.current?.scrollHeight, scrollerRef.current?.scrollWidth]
  );

  // useEffect(() => {
  //   setIsScrolling(false);
  // }, [scrollPositionDebounced]);

  useEffect(() => {
    autoAdjustColWidth();

    onWindowResize();
    window.addEventListener("resize", onWindowResize);
    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pinnedColumns?.leftWidth) headerWrapperRef.current?.updateLockedStartTransform(scrollerRef.current?.scrollLeft ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinnedColumns?.leftColumns.length, verticalScrollbarWidth]);

  useEffect(() => {
    if (pinnedColumns?.rightWidth)
      headerWrapperRef.current?.updateLockedEndTransform((scrollerRef.current?.scrollLeft ?? 0) - verticalScrollbarWidth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinnedColumns?.rightColumns.length, verticalScrollbarWidth]);

  useEffect(() => {
    if (tp.data) tableTools.updateSelectedRowsMultiple(new Set());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tp.data]);

  const onBodyScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const leftScroll = e.currentTarget.scrollLeft;
    const topScroll = e.currentTarget.scrollTop;

    headerWrapperRef.current?.updateHeaderTransform(-leftScroll);

    if (pinnedColumns?.leftWidth) headerWrapperRef.current?.updateLockedStartTransform(leftScroll);
    if (pinnedColumns?.rightWidth) headerWrapperRef.current?.updateLockedEndTransform(leftScroll - verticalScrollbarWidth);
    if (topScroll !== topScrollPosition) updateScrollPositionY(topScroll);
  };

  function onColumnHeaderFocus(e: React.FocusEvent<HTMLDivElement>, colWidth: number) {
    const colOffset = e.currentTarget.getBoundingClientRect().left;
    const totalWidth = dataGridRef.current?.clientWidth;
    if (colOffset > totalWidth! - colWidth - (pinnedColumns?.rightWidth ?? 0))
      scrollerRef.current?.scrollBy({
        left: colWidth,
        behavior: "smooth",
      });
    else if (colOffset - colWidth - (pinnedColumns?.leftWidth ?? 0) < 0)
      scrollerRef.current?.scrollTo({
        left: 0,
        behavior: "smooth",
      });
  }

  function autoAdjustColWidth() {
    if (!tp.autoAdjustColWidthOnInitialRender) return;
    const columnsToCalculate = initiateColumns();
    const sum = columnsToCalculate.reduce((width, col) => width + col.width, 0);
    const containerWidth = dataGridRef.current?.clientWidth;
    if (containerWidth && containerWidth > sum) {
      const dataColumns = columnsToCalculate.filter((x) => x.type === "data");
      const difference = containerWidth - sum;
      const sharedWidth = (difference - dimensions.defaultScrollbarWidth) / dataColumns.length;
      const dimensionsToAssign: Record<string, number> = {};
      dataColumns.forEach((col) => (dimensionsToAssign[col.key] = col.width + sharedWidth));
      tableTools.updateColumnWidthMultiple(dimensionsToAssign);
    }
  }

  const [optionsMenu, optionsMenuProps, displayOptionsMenu] = useActionsMenuFactory(
    (_, hide) => (
      <OptionsMenu
        toggleFullScreenMode={tp.fullScreenToggle !== false ? toggleFullScreenMode : undefined}
        handleColumnVisibility={tableTools.updateColumnVisibility}
        visibleColumnKeys={tableTools.visibleColumns}
        hideMenu={hide}
      />
    ),
    {
      className: "options-menu",
    }
  );

  function toggleFullScreenMode() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      dataGridRef.current?.requestFullscreen();
    }
  }

  return (
    <div
      ref={dataGridRef}
      data-theme={theme}
      className={cs(
        "data-grid",
        theme === "dark" && "theme-dark",
        striped && "striped",
        tp.isHoverable && "hoverable",
        tp.borderedCell !== false && "bordered",
        virtualizationEnabled && "virtualized",
        tp.className
      )}
      {...props}
    >
      {tableTools.isColumnResizing && <ColumnResizingOverlay />}
      {optionsMenu}
      {children}
      <Body>
        <ColumnLayout style={{ height: layoutDimensions.containerHeight }}>
          <HeaderLayout>
            <HeaderWrapper
              onColumnHeaderFocus={onColumnHeaderFocus}
              pinnedColumns={pinnedColumns as any}
              columnsInUse={columnsInUse as any}
              totalColumnsWidth={totalColumnsWidth}
              verticalScrollbarWidth={verticalScrollbarWidth}
              tp={tp as any}
              tableTools={tableTools as any}
              ref={headerWrapperRef}
              dataTools={dataTools as any}
              headerActionsMenu={{
                displayHeaderActionsMenu: displayHeaderActionsMenu as any,
              }}
              filterFnsMenu={filterFnsMenu as any}
              containerHeight={containerHeight}
            />
          </HeaderLayout>
          <List
            style={{
              height: containerHeight,
            }}
          >
            <LoadingOverlay
              visible={
                dataTools.progressReporters.has("filter-select") ||
                dataTools.progressReporters.has("pagination") ||
                dataTools.progressReporters.has("sort")
                // || tp.loading === true
              }
            />
            <EmptyDataGrid visible={!tp.loading && (!dataTools.data || dataTools.data?.length === 0)} />
            {tp.loading && <LoadingSkeleton containerHeight={containerHeight > 0 ? containerHeight : 0} />}
            {!tp.loading && (
              <ScrollContainer>
                <Scroller
                  ref={scrollerRef}
                  onScroll={onBodyScroll}
                  minWidth={totalColumnsWidth}
                  minHeight={
                    (dataTools.data?.length ?? 0) * dimensions.defaultDataRowHeight +
                    // To address bordered-cell (border-bottom, see ViewContainer and theming.css).
                    tableTools.expandedRowKeys.size * dimensions.defaultExpandPanelHeight
                  }
                  verticalScrollbarWidth={verticalScrollbarWidth}
                  emptySpacerVisible={!tp.loading && (!dataTools.data || dataTools.data?.length === 0)}
                  // className={cs(isScrolling && "scrolling-active")}
                >
                  <ViewContainer
                    columnsInUse={columnsInUse as any}
                    pinnedColumns={pinnedColumns as any}
                    topScrollPosition={topScrollPosition}
                    tableTools={tableTools as any}
                    dataTools={dataTools as any}
                    tp={tp as any}
                    totalColumnsWidth={totalColumnsWidth}
                    containerHeight={containerHeight}
                    containerWidth={layoutDimensions.containerWidth}
                    ref={viewContainerRef}
                    displayActionsMenu={displayDataActionsMenu as any}
                  />
                </Scroller>
              </ScrollContainer>
            )}
          </List>
          <Footer
            columnVisibilityOptions={tp.columnVisibilityOptions}
            paginationProps={{
              ...dataTools.paginationProps,
              ...(!tp.serverSide ? { dataCount: dataTools.dataWithoutPagination?.length } : undefined),
            }}
            progressReporters={dataTools.progressReporters}
            selectedRows={tableTools.selectedRows}
            optionsMenu={{
              displayOptionsMenu: displayOptionsMenu,
              isMenuVisible: optionsMenuProps.visible,
            }}
            loading={tp.loading}
            updatePaginationProps={dataTools.updatePaginationProps}
            toggleFullScreenMode={tp.fullScreenToggle !== false ? toggleFullScreenMode : undefined}
          />
        </ColumnLayout>
      </Body>
    </div>
  );
}
export default DataGrid;
