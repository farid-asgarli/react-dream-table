import React, { useImperativeHandle, useRef } from "react";
import MenuButton from "../../components/ui/Buttons/MenuButton/MenuButton";
import SortButton from "../../components/ui/Buttons/SortButton/SortButton";
import Checkbox from "../../components/ui/Checkbox/Checkbox";
import { HeaderWrapperProps } from "../../types/Elements";
import { InputFiltering, SelectFiltering } from "../../types/DataGrid";
import { ColumnDefinitionExtended, FilteringProps, GridDataType } from "../../types/Utils";
import { cs } from "../../utils/ConcatStyles";
import ColumnHeader from "../ColumnHeader/ColumnHeader";
import Header from "../Header/Header";
import HeaderOrdering from "../HeaderOrdering/HeaderOrdering";
import HeaderWrapperFill from "../HeaderWrapperFill/HeaderWrapperFill";
import LockedEndWrapper from "../LockedEndWrapper/LockedEndWrapper";
import LockedStartWrapper from "../LockedStartWrapper/LockedStartWrapper";
import CollapseAllButton from "../../components/ui/Buttons/CollapseAllButton/CollapseAllButton";
import GroupedColumnsWrapper from "../GroupedColumnsWrapper/GroupedColumnsWrapper";
import "./HeaderWrapper.scss";

export type HeaderWrapperRef = {
  updateHeaderTransform: (scroll: number, verticalScrollbarWidth: number) => void;
  updateLockedStartTransform: (scroll: number) => void;
  updateLockedEndTransform: (scroll: number) => void;
};

function HeaderWrapper<DataType extends GridDataType>({
  columnsToRender,
  totalColumnsWidth,
  verticalScrollbarWidth,
  pinnedColumns,
  gridTools,
  dataTools,
  gridProps,
  onColumnHeaderFocus,
  headerActionsMenu,
  filterFnsMenu,
  containerHeight,
  headerWrapperRef,
  groupedColumnHeaders,
  ...props
}: React.HtmlHTMLAttributes<HTMLDivElement> & HeaderWrapperProps<DataType>) {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const lockedStartWrapperRef = useRef<HTMLDivElement | null>(null);
  const lockedEndWrapperRef = useRef<HTMLDivElement | null>(null);

  function updateTransform(ref: React.MutableRefObject<HTMLDivElement | null>, scrollValue: number) {
    ref.current!.style.transform = `translate3d(${scrollValue}px, 0px, 0px)`;
  }

  useImperativeHandle(
    headerWrapperRef,
    () => ({
      updateHeaderTransform: (scrollValue, verticalScroll) => {
        headerRef.current!.style.transform = `translate3d(${-scrollValue}px, 0px, 0px)`;
        if (lockedStartWrapperRef.current)
          lockedStartWrapperRef.current.style.transform = `translate3d(${scrollValue}px, 0px, 0px)`;
        if (lockedEndWrapperRef.current)
          lockedEndWrapperRef.current.style.transform = `translate3d(${scrollValue - verticalScroll}px, 0px, 0px)`;
      },
      updateLockedStartTransform: (val) => updateTransform(lockedStartWrapperRef, val),
      updateLockedEndTransform: (val) => updateTransform(lockedEndWrapperRef, val),
    }),
    []
  );

  function renderColumnHeader(col: ColumnDefinitionExtended<DataType>, index: number) {
    const { key, title, type, filteringProps, filter, sort, headerAlignment, headerRender, pinned } = col;

    const isColumnDefinitionUtil = type !== "data";
    let children: React.ReactNode;
    let tableHeadCellProps;
    switch (type) {
      case "data":
        const isFilterFnActive = gridTools.isFilterFnIsActive(key);
        children = title;
        tableHeadCellProps = {
          filterFnsProps: isFilterFnActive
            ? {
                ...filterFnsMenu,
                getColumnFilterFn: dataTools.getColumnFilterFn,
                isFilterFnActive: dataTools.isFilterFnActive,
              }
            : undefined,
          filterProps: filter
            ? ({
                updateFilterValue: dataTools.updateCurrentFilterValue,
                getColumnFilterValue: dataTools.getColumnFilterValue,
                fetchFilters: dataTools.pipeFetchedFilters,
                prefetchedFilters: dataTools.prefetchedFilters,
                type: filteringProps?.type,
                render: (filteringProps as SelectFiltering)?.render,
                multiple: (filteringProps as SelectFiltering)?.multipleSelection,
                progressReporters: dataTools.progressReporters,
                filterInputProps: (filteringProps as InputFiltering)?.inputProps,
                renderCustomInput: (filteringProps as InputFiltering)?.renderCustomInput,
                isRangeInput: dataTools.isRangeFilterFn(dataTools.getColumnFilterFn(key).current),
                disableInputIcon: isFilterFnActive,
              } as FilteringProps)
            : undefined,
          toolBoxes: [
            sort ? (
              <SortButton
                sortingDirection={
                  dataTools.currentSorting?.key === key ? dataTools.currentSorting?.direction : undefined
                }
                key={`${key}_sort`}
                onClick={() => dataTools.updateCurrentSorting(key)}
              />
            ) : undefined,
            gridTools.isHeaderMenuActive ? (
              <MenuButton
                key={`${key}_menu`}
                onClick={(e) =>
                  headerActionsMenu.displayHeaderActionsMenu({
                    data: { id: col.key } as any,
                    position: {
                      xAxis: e.currentTarget.getBoundingClientRect().x,
                      yAxis: e.currentTarget.getBoundingClientRect().y + 20,
                    },
                    identifier: col.key,
                  })
                }
              />
            ) : undefined,
          ],
        };
        break;
      case "expand":
        children = <CollapseAllButton onClick={() => gridTools.closeExpandedRows()} />;
        break;
      case "select":
        children = (
          <Checkbox
            onChange={(e) =>
              gridTools.updateSelectedRowsMultiple(
                !e.target.checked
                  ? new Set()
                  : new Set(dataTools.dataWithoutPagination!.map((x) => x[gridProps.uniqueRowKey]))
              )
            }
            checked={
              dataTools.currentPagination.dataCount !== 0 &&
              (!!gridProps.serverSide?.enabled
                ? dataTools.data?.length === gridTools.selectedRows.size
                : gridProps.data?.length === gridTools.selectedRows.size)
            }
          />
        );
        break;
      default:
        break;
    }

    return React.createElement(
      ColumnHeader<DataType>,
      {
        columnProps: col,
        resizingProps: {
          isResizable: !isColumnDefinitionUtil && gridTools.isColumnIsResizable(key),
          updateColumnWidth: gridTools.updateColumnWidth,
          updateColumnResizingStatus: gridTools.updateColumnResizingStatus,
        },
        draggingProps: {
          isDraggable: !pinned && !isColumnDefinitionUtil && !!gridTools.isColumnIsDraggable(key),
        },
        tabIndex: !isColumnDefinitionUtil ? index : undefined,
        key: col.key + `__${dataTools.filterResetKey}`,
        onFocus: (e) => onColumnHeaderFocus(e, col.width),
        style: {
          width: col.width,
          minWidth: col.width,
          maxWidth: col.width,
        },
        className: cs(
          isColumnDefinitionUtil && "tools",
          gridTools.isHeaderIsActive(col.key) && "hover-active",
          headerAlignment && `align-${headerAlignment}`
        ),
        containerHeight: containerHeight,
        isFilterMenuVisible: gridTools.isFilterMenuVisible && filter,
        ...(!isColumnDefinitionUtil && tableHeadCellProps),
      },
      headerRender ? headerRender() : children
    );
  }

  return (
    <div className="header-wrapper" {...props}>
      <Header ref={headerRef} style={{ minWidth: totalColumnsWidth }}>
        {!!pinnedColumns?.leftWidth && (
          <LockedStartWrapper type="header" ref={lockedStartWrapperRef}>
            <GroupedColumnsWrapper groupedColumnHeaders={groupedColumnHeaders.leftLockedGroupedColumnHeaders}>
              {pinnedColumns?.leftColumns.map((col, index) => renderColumnHeader(col, index + 1))}
            </GroupedColumnsWrapper>
          </LockedStartWrapper>
        )}
        <GroupedColumnsWrapper groupedColumnHeaders={groupedColumnHeaders.unlockedGroupedColumnHeaders}>
          <HeaderOrdering
            columnOrder={gridTools.columnOrder}
            columns={columnsToRender.columns}
            setColumnOrder={gridTools.updateColumnOrder}
            onColumnDragged={gridProps.draggableColumns?.onColumnDragged}
            draggingEnabled={gridProps.draggableColumns?.enabled === true}
          >
            {columnsToRender.columns.map((col, index) =>
              renderColumnHeader(col, index + (pinnedColumns?.leftColumns.length ?? 0) + 1)
            )}
          </HeaderOrdering>
        </GroupedColumnsWrapper>
        {!!pinnedColumns?.rightWidth && (
          <LockedEndWrapper type="header" ref={lockedEndWrapperRef}>
            <GroupedColumnsWrapper groupedColumnHeaders={groupedColumnHeaders.rightLockedGroupedColumnHeaders}>
              {pinnedColumns?.rightColumns.map((col, index) =>
                renderColumnHeader(
                  col,
                  index + ((pinnedColumns?.leftColumns.length ?? 0) + columnsToRender.columns.length) + 1
                )
              )}
            </GroupedColumnsWrapper>
          </LockedEndWrapper>
        )}
      </Header>
      {!!pinnedColumns?.rightWidth && (
        <HeaderWrapperFill
          style={{
            width: verticalScrollbarWidth,
          }}
        />
      )}
    </div>
  );
}
export default HeaderWrapper;
