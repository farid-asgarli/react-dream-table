import { throttle } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import EmptyTable from "../../components/ui/EmptyTable/EmptyTable";
import LoadingOverlay from "../../components/ui/LoadingOverlay/LoadingOverlay";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton/LoadingSkeleton";
import { useDataGridContext } from "../../context/DataGridContext";
// import { useDebounce } from "../../hooks/use-debounce/use-debounce";
import { DataGridProps } from "../../types/Elements";
import { cs } from "../../utils/ConcatStyles";
import Body from "../Body/Body";
import ColumnLayout from "../ColumnLayout/ColumnLayout";
import Footer from "../Footer/Footer";
import HeaderLayout from "../HeaderLayout/HeaderLayout";
import HeaderWrapper, { HeaderWrapperRef } from "../HeaderWrapper/HeaderWrapper";
import List from "../List/List";
import ScrollContainer from "../ScrollContainer/ScrollContainer";
import Scroller from "../Scroller/Scroller";
import ViewContainer from "../ViewContainer/ViewContainer";
import "./DataGrid.css";

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
  optionsMenu,
  filterFnsMenu,
  ...props
}: DataGridProps<DataType>) {
  const { dimensions, striped } = useDataGridContext();

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
  // const [isScrolling, setIsScrolling] = useState<boolean>(false);
  // const virtualListHeight = (dataGridRef.current?.clientHeight ?? 0) - (headerLayoutRef.current?.clientHeight ?? 0);
  const virtualListHeight = useMemo(
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

  // const scrollPositionDebounced = useDebounce(topScrollPosition, 500);

  const updateScrollPositionY = React.useMemo(
    () =>
      throttle(
        (top: number) => {
          // setIsScrolling(true);
          setTopScrollPosition(top);
        },
        50,
        { leading: false }
      ),
    []
  );

  const verticalScrollbarWidth = useMemo(
    () =>
      // horizontal scroll olanda tersine olmalidi mentiq
      scrollerRef.current?.scrollWidth! > scrollerRef.current?.clientWidth! &&
      scrollerRef.current?.scrollHeight! > scrollerRef.current?.clientHeight!
        ? dimensions.defaultScrollbarWidth
        : 0,
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
    if (pinnedColumns?.rightWidth) {
      headerWrapperRef.current?.updateLockedEndTransform(
        (scrollerRef.current?.scrollLeft ?? 0) - verticalScrollbarWidth
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinnedColumns?.rightWidth, verticalScrollbarWidth]);

  useEffect(() => {
    if (tp.data) tableTools.updateSelectedRowsMultiple(new Set());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tp.data]);

  function onBodyScroll(e: React.UIEvent<HTMLDivElement>) {
    const leftScroll = e.currentTarget.scrollLeft;
    const topScroll = e.currentTarget.scrollTop;

    // viewContainerRef.current!.style.transform = `translate3d(${-leftScroll}px, ${-topScroll}px, 0px)`;

    headerWrapperRef.current?.updateHeaderTransform(-leftScroll);
    if (pinnedColumns?.leftWidth) {
      headerWrapperRef.current?.updateLockedStartTransform(leftScroll);
    }
    //#1 -(e.currentTarget.scrollWidth - e.currentTarget.clientWidth - leftScroll)
    //#2 (leftScroll - verticalScrollbarWidth)

    if (pinnedColumns?.rightWidth)
      headerWrapperRef.current?.updateLockedEndTransform(leftScroll - verticalScrollbarWidth);

    if (topScroll !== topScrollPosition) {
      updateScrollPositionY(topScroll);
    }
  }

  function onColumnHeaderFocus(e: React.FocusEvent<HTMLDivElement>, colWidth: number) {
    const colOffset = e.currentTarget.offsetLeft;

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

  return (
    <div
      ref={dataGridRef}
      data-theme={theme}
      className={cs(
        "data-grid",
        theme === "dark" && "theme-dark",
        striped && "striped",
        tp.isHoverable && "hoverable",
        tp.borderedCell !== false && "bordered"
      )}
      {...props}
    >
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
            />
          </HeaderLayout>
          <List
            style={{
              height: virtualListHeight,
            }}
          >
            <LoadingOverlay
              visible={
                dataTools.progressReporters.has("filter-select") ||
                dataTools.progressReporters.has("pagination") ||
                dataTools.progressReporters.has("sort")
              }
            />
            <EmptyTable visible={!tp.loading && (!dataTools.data || dataTools.data?.length === 0)} />
            {tp.loading ? (
              <LoadingSkeleton containerHeight={virtualListHeight > 0 ? virtualListHeight : 0} />
            ) : (
              <ScrollContainer>
                <Scroller
                  ref={scrollerRef}
                  onScroll={onBodyScroll}
                  minWidth={totalColumnsWidth}
                  minHeight={
                    (dataTools.data?.length ?? 0) *
                      (dimensions.defaultDataRowHeight +
                        // To address bordered-cell (border-bottom, see ViewContainer and theming.css).
                        1) +
                    tableTools.expandedRowKeys.size * dimensions.defaultExpandPanelHeight
                  }
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
                    containerHeight={virtualListHeight}
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
              displayOptionsMenu: optionsMenu.displayOptionsMenu,
              isMenuVisible: optionsMenu.isOptionsMenuVisible,
            }}
            loading={tp.loading}
            updatePaginationProps={dataTools.updatePaginationProps}
          />
        </ColumnLayout>
      </Body>
    </div>
  );
}
export default DataGrid;
