import { throttle } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import EmptyTable from "../../components/ui/EmptyTable/EmptyTable";
import LoadingOverlay from "../../components/ui/LoadingOverlay/LoadingOverlay";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton/LoadingSkeleton";
import { useTableContext } from "../../context/TableContext";
import { useDebounce } from "../../hooks/use-debounce/use-debounce";
import { DataGridProps } from "../../types/Elements";
import { KeyLiteralType } from "../../types/Table";
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
  tools,
  pinnedColumns,
  totalColumnsWidth,
  columnsInUse,
  initiateColumns,
  children,
  ...props
}: DataGridProps<DataType>) {
  const { dimensions, striped } = useTableContext();

  const dataGridRef = useRef<HTMLDivElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const headerWrapperRef = useRef<HeaderWrapperRef | null>(null);

  const [colLayoutHeight, setColLayoutHeight] = useState<number>(0);
  // const virtualListHeight = (dataGridRef.current?.clientHeight ?? 0) - (headerLayoutRef.current?.clientHeight ?? 0);
  const virtualListHeight =
    colLayoutHeight -
    (dimensions.defaultHeadRowHeight + dimensions.defaultHeaderFilterHeight + dimensions.defaultFooterHeight);

  const [scrollPosition, setScrollPosition] = useState<{
    left: number;
    top: number;
  }>({
    left: 0,
    top: 0,
  });

  function onWindowResize() {
    if (dataGridRef.current?.clientHeight) setColLayoutHeight(dataGridRef.current?.clientHeight);
  }

  const val = useDebounce(scrollPosition, 500);

  const updateScrollPosition = React.useMemo(
    () =>
      throttle(
        (position: { left: number; top: number }) => {
          setScrollPosition(position);
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
        ? 20
        : 0,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scrollerRef.current?.scrollHeight, scrollerRef.current?.scrollWidth]
  );

  useEffect(() => {
    if (scrollerRef.current) scrollerRef.current.style.contain = "";
  }, [val]);

  useEffect(() => {
    onWindowResize();
    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  useEffect(() => {
    autoAdjustColWidth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pinnedColumns?.rightWidth) {
      headerWrapperRef.current?.updateLockedEndTransform(scrollPosition.left - verticalScrollbarWidth);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinnedColumns?.rightWidth, verticalScrollbarWidth]);

  function onBodyScroll(e: React.UIEvent<HTMLDivElement>) {
    e.currentTarget.style.contain = "strict";
    const leftScroll = e.currentTarget.scrollLeft;

    const topScroll = e.currentTarget.scrollTop;
    headerWrapperRef.current?.updateHeaderTransform(-leftScroll);
    if (pinnedColumns?.leftColumns) {
      if (leftScroll !== scrollPosition.left) headerWrapperRef.current?.updateLockedStartTransform(leftScroll);
    }
    //#1 -(e.currentTarget.scrollWidth - e.currentTarget.clientWidth - leftScroll)
    //#2 (leftScroll - verticalScrollbarWidth)

    if (pinnedColumns?.rightColumns)
      if (leftScroll !== scrollPosition.left)
        headerWrapperRef.current?.updateLockedEndTransform(leftScroll - verticalScrollbarWidth);

    updateScrollPosition({ top: topScroll, left: leftScroll });
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
      const sharedWidth = (difference - 20) / dataColumns.length;
      const dimensionsToAssign: Record<KeyLiteralType<DataType>, number> = {} as Record<
        KeyLiteralType<DataType>,
        number
      >;
      dataColumns.forEach((col) => (dimensionsToAssign[col.key] = col.width + sharedWidth));
      tools.setColumnDimensions(dimensionsToAssign);
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
        tp.borderedCell && "bordered"
      )}
      {...props}
    >
      {children}
      <Body>
        <ColumnLayout style={{ height: colLayoutHeight }}>
          <HeaderLayout>
            <HeaderWrapper
              onColumnHeaderFocus={onColumnHeaderFocus}
              pinnedColumns={pinnedColumns as any}
              columnsInUse={columnsInUse as any}
              totalColumnsWidth={totalColumnsWidth}
              verticalScrollbarWidth={verticalScrollbarWidth}
              tp={tp as any}
              tools={tools as any}
              ref={headerWrapperRef}
            />
          </HeaderLayout>
          <List
            style={{
              height: virtualListHeight,
            }}
          >
            <LoadingOverlay
              visible={
                tools.dataTools.progressReporters.has("filter-select") ||
                tools.dataTools.progressReporters.has("pagination") ||
                tools.dataTools.progressReporters.has("sort")
              }
            />
            <EmptyTable visible={!tp.loading && (!tools.dataTools.data || tools.dataTools.data?.length === 0)} />
            {tp.loading ? (
              <LoadingSkeleton containerHeight={virtualListHeight > 0 ? virtualListHeight : 0} />
            ) : (
              <ScrollContainer>
                <Scroller
                  ref={scrollerRef}
                  onScroll={onBodyScroll}
                  minWidth={totalColumnsWidth}
                  minHeight={
                    (tools.dataTools.data?.length ?? 0) * dimensions.defaultDataRowHeight +
                    tools.expandedRowKeys.size * dimensions.defaultExpandPanelHeight
                  }
                  emptySpacerVisible={!tp.loading && (!tools.dataTools.data || tools.dataTools.data?.length === 0)}
                >
                  <ViewContainer
                    columnsInUse={columnsInUse}
                    pinnedColumns={pinnedColumns}
                    scrollPosition={scrollPosition.top}
                    tools={tools}
                    tp={tp}
                    totalColumnsWidth={totalColumnsWidth}
                    containerHeight={scrollerRef.current?.clientHeight}
                  />
                </Scroller>
              </ScrollContainer>
            )}
          </List>
          <Footer
            columnVisibilityOptions={tp.columnVisibilityOptions}
            paginationProps={{
              ...tools.dataTools.paginationProps,
              ...(!tp.serverSide ? { dataCount: tools.dataTools.dataWithoutPagination?.length } : undefined),
            }}
            progressReporters={tools.dataTools.progressReporters}
            selectedRows={tools.selectedRows}
            settingsMenu={{
              props: {
                handleColumnVisibility: tools.handleColumnVisibility,
                visibleColumnKeys: tools.visibleColumns,
              },
              displaySettingsMenu: tools.displaySettingsMenu,
              hideSettingsMenu: tools.hideSettingsMenu,
              visibility: tools.settingsMenuVisibility,
            }}
            loading={tp.loading}
            updatePaginationProps={tools.dataTools.updatePaginationProps}
          />
        </ColumnLayout>
      </Body>
    </div>
  );
}
export default DataGrid;
