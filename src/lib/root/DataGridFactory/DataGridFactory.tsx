import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import EmptyDataGrid from "../../components/ui/EmptyDataGrid/EmptyDataGrid";
import LoadingOverlay from "../../components/ui/LoadingOverlay/LoadingOverlay";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton/LoadingSkeleton";
import { OptionsMenu } from "../../components/ui/SettingsMenu/SettingsMenu";
import { useDataGridStaticContext } from "../../context/DataGridStaticContext";
import useActionsMenuFactory from "../../logic/tools/actions-menu-factory";
import { useVirtualizedRows } from "../../logic/tools/virtualized-rows";
import { DataGridFactoryProps } from "../../types/Elements";
import { GridDataType } from "../../types/Utils";
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
import "./DataGridFactory.scss";

function DataGrid<DataType extends GridDataType>({
  theme,
  gridProps,
  gridTools,
  dataTools,
  pinnedColumns,
  totalColumnsWidth,
  columnsToRender,
  initializedColumns,
  groupedColumnHeaders,
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
      (dimensions.defaultHeadRowHeight +
        (gridTools.isFilterMenuVisible ? dimensions.defaultHeaderFilterHeight : 0) +
        (gridTools.isColumnGroupingEnabled ? dimensions.defaultGroupedColumnHeight : 0) +
        dimensions.defaultFooterHeight),
    [
      layoutDimensions.containerHeight,
      dimensions.defaultHeadRowHeight,
      dimensions.defaultHeaderFilterHeight,
      dimensions.defaultGroupedColumnHeight,
      dimensions.defaultFooterHeight,
      gridTools.isFilterMenuVisible,
      gridTools.isColumnGroupingEnabled,
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

  const updateScrollPositionY = useCallback(
    (top: number) => {
      if (gridTools.isVirtualizationIsEnabled) setTopScrollPosition(top);
    },
    [gridTools.isVirtualizationIsEnabled]
  );

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

  useEffect(() => {
    if (gridProps.autoAdjustColWidthOnInitialRender) {
      autoAdjustColWidth();
    }

    onWindowResize();
    window.addEventListener("resize", onWindowResize);
    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridTools.isFullScreenModeEnabled]);

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
    if (gridProps.data) gridTools.updateSelectedRowsMultiple(new Set());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridProps.data]);

  useEffect(() => {
    if (scrollerRef.current && scrollerRef.current.scrollTop !== 0)
      scrollerRef.current?.scrollTo({
        behavior: "smooth",
        top: 0,
      });
  }, [dataTools.currentPagination.currentPage]);

  useEffect(() => {
    if (gridTools.isVirtualizationIsEnabled) {
      scrollerRef.current?.scrollTo({
        behavior: "smooth",
        top: 0,
      });
    }
  }, [gridTools.isVirtualizationIsEnabled]);

  const onBodyScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const topScroll = e.currentTarget.scrollTop;

    headerWrapperRef.current?.updateHeaderTransform(e.currentTarget.scrollLeft, verticalScrollbarWidth);
    if (topScroll !== topScrollPosition && Math.abs(topScroll - topScrollPosition) > 100) updateScrollPositionY(topScroll);
  };

  const onColumnHeaderFocus = useCallback(
    (e: React.FocusEvent<HTMLDivElement>, colWidth: number) => {
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
    },
    [pinnedColumns?.leftWidth, pinnedColumns?.rightWidth]
  );

  function autoAdjustColWidth() {
    const columnsToCalculate = initializedColumns;
    const sum = columnsToCalculate.reduce((width, col) => width + col.width, 0);
    const containerWidth = dataGridRef.current?.clientWidth;
    if (containerWidth && containerWidth > sum) {
      const dataColumns = columnsToCalculate.filter((x) => x.type === "data");
      const difference = containerWidth - sum;
      const sharedWidth = (difference - dimensions.defaultScrollbarWidth) / dataColumns.length;
      const dimensionsToAssign: Record<string, number> = {};
      dataColumns.forEach((col) => (dimensionsToAssign[col.key] = col.width + sharedWidth));
      gridTools.updateColumnWidthMultiple(dimensionsToAssign);
    }
  }

  const [optionsMenu, optionsMenuProps, displayOptionsMenu] = useActionsMenuFactory(
    () => (
      <OptionsMenu
        updateColumnVisibility={gridTools.updateColumnVisibility}
        visibleColumnKeys={gridTools.visibleColumns}
        isDarkModeEnabled={gridTools.isDarkModeEnabled}
        isFullScreenModeEnabled={gridTools.isFullScreenModeEnabled}
        isFilterMenuVisible={gridTools.isFilterMenuVisible}
        isColumnGroupingEnabled={gridTools.isColumnGroupingEnabled}
        updateDarkMode={gridTools.updateDarkMode}
        updateFullScreenMode={gridTools.updateFullScreenMode}
        updateActiveHeader={gridTools.updateActiveHeader}
        updateFilterMenuVisibility={gridTools.updateFilterMenuVisibility}
        updateColumnGrouping={gridTools.updateColumnGrouping}
        optionsMenuProps={gridProps.settingsMenu}
        isColumnVisibilityEnabled={!!gridProps.columnVisibilityOptions?.enabled}
      />
    ),
    {
      className: "options-menu",
    }
  );

  const indexedData = useMemo(() => {
    if (gridTools.isVirtualizationIsEnabled)
      return dataTools.data?.map((d, i) => ({
        ...d,
        __virtual_row_index: i,
      }));
  }, [dataTools.data, gridTools.isVirtualizationIsEnabled]);

  const { getRowExpansionHeight, getTotalExpansionHeight } = useVirtualizedRows(
    indexedData,
    {
      expandedRowKeys: gridTools.expandedRowKeys,
      expandRowHeightCache: gridTools.expandRowHeightCache,
      getExpandRowHeightFromCache: gridTools.getExpandRowHeightFromCache,
      isDynamicRowExpandHeightEnabled: gridTools.isDynamicRowExpandHeightEnabled,
      __lastExpRowCache: gridTools.__lastExpRowCache,
    },
    dimensions.defaultExpandPanelHeight,
    gridTools.isVirtualizationIsEnabled
  );

  return (
    <div
      ref={dataGridRef}
      data-theme={gridTools.isDarkModeEnabled ? "dark" : "light"}
      className={cs(
        "data-grid",
        striped && "striped",
        gridProps.isHoverable && "hoverable",
        gridProps.borderedCell !== false && "bordered",
        virtualizationEnabled && "virtualized",
        gridProps.className,
        gridTools.isFullScreenModeEnabled && "full-screen-mode"
      )}
      {...props}
    >
      {gridTools.isColumnResizing && <ColumnResizingOverlay />}
      {gridProps.settingsMenu?.enabled !== false && optionsMenu}
      {children}
      <Body>
        <ColumnLayout style={{ height: layoutDimensions.containerHeight }}>
          <HeaderLayout>
            <HeaderWrapper
              onColumnHeaderFocus={onColumnHeaderFocus}
              pinnedColumns={pinnedColumns}
              columnsToRender={columnsToRender}
              totalColumnsWidth={totalColumnsWidth}
              verticalScrollbarWidth={verticalScrollbarWidth}
              gridProps={gridProps}
              gridTools={gridTools}
              headerWrapperRef={headerWrapperRef}
              dataTools={dataTools}
              headerActionsMenu={{
                displayHeaderActionsMenu: displayHeaderActionsMenu,
              }}
              filterFnsMenu={filterFnsMenu}
              containerHeight={containerHeight}
              groupedColumnHeaders={groupedColumnHeaders}
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
                // || true
              }
            />
            <EmptyDataGrid visible={!gridProps.loading && !dataTools.data?.length} />
            {gridProps.loading && <LoadingSkeleton containerHeight={containerHeight > 0 ? containerHeight : 0} />}
            {!gridProps.loading && (
              <ScrollContainer>
                <Scroller
                  ref={scrollerRef}
                  onScroll={onBodyScroll}
                  minWidth={totalColumnsWidth}
                  minHeight={(dataTools.data?.length ?? 0) * dimensions.defaultDataRowHeight + (getTotalExpansionHeight ?? 0)}
                  verticalScrollbarWidth={verticalScrollbarWidth}
                  emptySpacerVisible={!gridProps.loading && (!dataTools.data || !dataTools.data?.length)}
                >
                  <ViewContainer
                    columnsToRender={columnsToRender}
                    pinnedColumns={pinnedColumns}
                    topScrollPosition={topScrollPosition}
                    gridTools={gridTools}
                    dataTools={dataTools}
                    gridProps={gridProps}
                    totalColumnsWidth={totalColumnsWidth}
                    containerHeight={containerHeight}
                    containerWidth={layoutDimensions.containerWidth}
                    viewRef={viewContainerRef}
                    displayActionsMenu={displayDataActionsMenu}
                    indexedData={indexedData!}
                    getRowExpansionHeight={getRowExpansionHeight}
                  />
                </Scroller>
              </ScrollContainer>
            )}
          </List>
          <Footer
            paginationProps={{
              updateCurrentPagination: dataTools.updateCurrentPagination,
              gridPaginationProps: {
                ...dataTools.currentPagination,
                ...(!gridProps.serverSide?.enabled ? { dataCount: dataTools.dataWithoutPagination?.length } : undefined),
              },
            }}
            progressReporters={dataTools.progressReporters}
            selectedRows={gridTools.selectedRows}
            optionsMenu={{
              displayOptionsMenu: displayOptionsMenu,
              isMenuVisible: optionsMenuProps.visible,
              enabled: gridProps.settingsMenu?.enabled !== false,
            }}
            loading={gridProps.loading}
          />
        </ColumnLayout>
      </Body>
    </div>
  );
}
export default DataGrid;
