import React, { useImperativeHandle, useRef } from "react";
import MenuButton from "../../components/ui/Buttons/MenuButton/MenuButton";
import SortButton from "../../components/ui/Buttons/SortButton/SortButton";
import Checkbox from "../../components/ui/Checkbox/Checkbox";
import { useDataGridStaticContext } from "../../context/DataGridStaticContext";
import { HeaderWrapperProps } from "../../types/Elements";
import { CommonDataType, InputFiltering, SelectFiltering } from "../../types/DataGrid";
import { ColumnDefinitionExtended, FilteringProps } from "../../types/Utils";
import { cs } from "../../utils/ConcatStyles";
import ColumnHeader from "../ColumnHeader/ColumnHeader";
import Header from "../Header/Header";
import HeaderOrdering from "../HeaderOrdering/HeaderOrdering";
import HeaderWrapperFill from "../HeaderWrapperFill/HeaderWrapperFill";
import LockedEndWrapper from "../LockedEndWrapper/LockedEndWrapper";
import LockedStartWrapper from "../LockedStartWrapper/LockedStartWrapper";
import "./HeaderWrapper.css";

export type HeaderWrapperRef = {
  updateHeaderTransform: (scroll: number) => void;
  updateLockedStartTransform: (scroll: number) => void;
  updateLockedEndTransform: (scroll: number) => void;
};

function HeaderWrapper<DataType extends CommonDataType>(
  {
    columnsInUse,
    totalColumnsWidth,
    verticalScrollbarWidth,
    pinnedColumns,
    tableTools,
    dataTools,
    tp,
    onColumnHeaderFocus,
    headerActionsMenu,
    filterFnsMenu,
    containerHeight,
    ...props
  }: React.HtmlHTMLAttributes<HTMLDivElement> & HeaderWrapperProps<DataType>,
  ref: React.ForwardedRef<HeaderWrapperRef>
) {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const lockedStartWrapperRef = useRef<HTMLDivElement | null>(null);
  const lockedEndWrapperRef = useRef<HTMLDivElement | null>(null);

  function updateTransform(ref: React.MutableRefObject<HTMLDivElement | null>, scrollValue: number) {
    ref.current!.style.transform = `translate3d(${scrollValue}px, 0px, 0px)`;
  }

  useImperativeHandle(
    ref,
    () => ({
      updateHeaderTransform: (val) => updateTransform(headerRef, val),
      updateLockedStartTransform: (val) => updateTransform(lockedStartWrapperRef, val),
      updateLockedEndTransform: (val) => updateTransform(lockedEndWrapperRef, val),
    }),
    []
  );

  const { dimensions } = useDataGridStaticContext();

  function renderColumnHeader(col: ColumnDefinitionExtended<DataType>, index: number) {
    const { key, title, type, filteringProps, filter, sort, headerAlignment, headerRender, pinned } = col;

    const isColumnDefinitionUtil = type !== "data";
    let children: React.ReactNode;
    let tableHeadCellProps;
    switch (type) {
      case "data":
        const isFilterFnActive = tableTools.checkIfFilterFnIsActive(key);
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
                isRangeInput: dataTools.isRangeFilterFn(dataTools.getColumnFilterFn(key as string).current),
                disableInputIcon: isFilterFnActive,
                pickerLocale: (filteringProps as any)?.pickerLocale,
              } as FilteringProps)
            : undefined,
          toolBoxes: [
            sort ? (
              <SortButton
                sortingDirection={dataTools.currentSorting?.key === key ? dataTools.currentSorting?.direction : undefined}
                key={`${key as string}_sort`}
                onClick={() => dataTools.sortData(key as string)}
              />
            ) : undefined,
            tableTools.checkIfHeaderMenuActive ? (
              <MenuButton
                key={`${key as string}_menu`}
                onClick={(e) =>
                  headerActionsMenu.displayHeaderActionsMenu({
                    data: { id: col.key } as any,
                    position: {
                      xAxis: e.currentTarget.getBoundingClientRect().x,
                      yAxis: e.currentTarget.getBoundingClientRect().y + 20,
                    },
                    identifier: col.key as string,
                  })
                }
              />
            ) : undefined,
          ],
        };
        break;
      case "select":
        children = (
          <Checkbox
            onChange={(e) =>
              tableTools.updateSelectedRowsMultiple(
                !e.target.checked ? new Set() : new Set(dataTools.dataWithoutPagination!.map((x) => x[tp.uniqueRowKey as string]))
              )
            }
            checked={
              dataTools.paginationProps.dataCount !== 0 &&
              (tp.serverSide ? dataTools.data?.length === tableTools.selectedRows.size : tp.data?.length === tableTools.selectedRows.size)
            }
          />
        );
        break;
      default:
        break;
    }

    return (
      <ColumnHeader
        columnProps={col as ColumnDefinitionExtended<unknown>}
        resizingProps={{
          isResizable: !isColumnDefinitionUtil && tableTools.checkIfColumnIsResizable(key),
          updateColumnWidth: tableTools.updateColumnWidth,
          updateColumnResizingStatus: tableTools.updateColumnResizingStatus,
        }}
        draggingProps={{
          isDraggable: !pinned && !isColumnDefinitionUtil && !!tableTools.checkIfColumnIsDraggable(key),
        }}
        tabIndex={!isColumnDefinitionUtil ? index : undefined}
        key={(col.key as string) + `__${dataTools.filterResetKey}`}
        onFocus={(e) => onColumnHeaderFocus(e, col.width)}
        style={{
          width: col.width,
          minWidth: col.width,
          maxWidth: col.width,
        }}
        className={cs(isColumnDefinitionUtil && "tools", headerAlignment && `align-${headerAlignment}`)}
        containerHeight={containerHeight}
        {...(!isColumnDefinitionUtil && tableHeadCellProps)}
      >
        {headerRender ? headerRender() : children}
      </ColumnHeader>
    );
  }

  return (
    <div className="header-wrapper" {...props}>
      <Header ref={headerRef} style={{ minWidth: totalColumnsWidth }}>
        {!!pinnedColumns?.leftWidth && (
          <LockedStartWrapper type="header" ref={lockedStartWrapperRef}>
            {pinnedColumns?.leftColumns.map((col, index) => renderColumnHeader(col, index + 1))}
          </LockedStartWrapper>
        )}
        <HeaderOrdering
          columnOrder={tableTools.columnOrder}
          columns={columnsInUse.columns}
          setColumnOrder={tableTools.updateColumnOrder}
          onColumnDragged={tp.draggableColumns?.onColumnDragged}
          draggingEnabled={tp.draggableColumns?.active === true}
        >
          {columnsInUse.columns.map((col, index) => renderColumnHeader(col, index + (pinnedColumns?.leftColumns.length ?? 0) + 1))}
        </HeaderOrdering>
        {!!pinnedColumns?.rightWidth && (
          <LockedEndWrapper type="header" ref={lockedEndWrapperRef}>
            {pinnedColumns?.rightColumns.map((col, index) =>
              renderColumnHeader(col, index + ((pinnedColumns?.leftColumns.length ?? 0) + columnsInUse.columns.length) + 1)
            )}
          </LockedEndWrapper>
        )}
      </Header>
      <HeaderWrapperFill
        style={{
          width: verticalScrollbarWidth,
          height:
            dimensions.defaultHeadRowHeight +
            dimensions.defaultHeaderFilterHeight +
            // Bottom - Border
            1,
          top: 0,
          right: 0 /** header-layout bottom-right is active */,
          zIndex: 99999999,
        }}
      />
    </div>
  );
}
export default React.forwardRef(HeaderWrapper);
