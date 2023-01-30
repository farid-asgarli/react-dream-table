import React, { useEffect, useImperativeHandle, useRef } from "react";
import MenuButton from "../../components/ui/Buttons/MenuButton/MenuButton";
import SortButton from "../../components/ui/Buttons/SortButton/SortButton";
import Checkbox from "../../components/ui/Checkbox/Checkbox";
import { useDataGridContext } from "../../context/DataGridContext";
import { useColumnResizer } from "../../hooks/use-column-resizer/use-column-resizer";
import { HeaderWrapperProps } from "../../types/Elements";
import { CommonDataType, InputFiltering, SelectFiltering } from "../../types/Table";
import { ColumnTypeExtended, FilteringProps } from "../../types/Utils";
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

  const { dimensions } = useDataGridContext();

  const headerDataRefs = useRef(new Map<string, HTMLDivElement | null>());

  useEffect(() => {
    if (
      headerDataRefs.current.size === 0
      //  && resizableColumns
    ) {
      headerDataRefs.current = new Map(headerDataRefs.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerDataRefs.current]);

  const { activeIndex, mouseDown } = useColumnResizer(
    headerRef,
    {
      headerDataRefs: headerDataRefs.current,
      onColumnResize: tableTools.updateColumnWidth,
      minColumnResizeWidth: dimensions.minColumnResizeWidth,
      maxColumnResizeWidth: dimensions.maxColumnResizeWidth,
    },
    // Enable column resizing if only 'true' or 'props' are passed as an arg.
    tp.resizableColumns?.active === true
  );

  function renderColumnHeader(col: ColumnTypeExtended<DataType>, index: number) {
    const { key, title, type, filteringProps, filter, sort, headerAlignment, headerRender, pinned } = col;

    const isColumnTypeUtil = type !== "data";
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
                isRangeInput: dataTools.isRangeFilterFn(dataTools.getColumnFilterFn(key as string)),
                disableInputIcon: isFilterFnActive,
                pickerLocale: (filteringProps as any)?.pickerLocale,
              } as FilteringProps)
            : undefined,
          toolBoxes: [
            sort ? (
              <SortButton
                sortingDirection={
                  dataTools.currentSorting?.key === key ? dataTools.currentSorting?.direction : undefined
                }
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
                !e.target.checked
                  ? new Set()
                  : new Set(dataTools.dataWithoutPagination!.map((x) => x[tp.uniqueRowKey as string]))
              )
            }
            checked={
              dataTools.paginationProps.dataCount !== 0 &&
              (tp.serverSide
                ? dataTools.data?.length === tableTools.selectedRows.size
                : tp.data?.length === tableTools.selectedRows.size)
            }
          />
        );
        break;
      default:
        break;
    }

    return (
      <ColumnHeader
        columnProps={col as ColumnTypeExtended<unknown>}
        resizingProps={{
          isResizable: !isColumnTypeUtil && tableTools.checkIfColumnIsResizable(key),
          onMouseDown: mouseDown,
          activeIndex: activeIndex,
        }}
        draggingProps={{
          isDraggable: !pinned && !isColumnTypeUtil && !!tableTools.checkIfColumnIsDraggable(key),
        }}
        ref={(ref: HTMLDivElement | null) => headerDataRefs.current.set(col.key as string, ref)}
        tabIndex={!isColumnTypeUtil ? index : undefined}
        key={(col.key as string) + `__${dataTools.filterResetKey}`}
        onFocus={(e) => onColumnHeaderFocus(e, col.width)}
        style={{
          width: col.width,
          minWidth: col.width,
          maxWidth: col.width,
        }}
        className={cs(isColumnTypeUtil && "tools", headerAlignment && `align-${headerAlignment}`)}
        {...(!isColumnTypeUtil && tableHeadCellProps)}
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
          {columnsInUse.columns.map((col, index) =>
            renderColumnHeader(col, index + (pinnedColumns?.leftColumns.length ?? 0) + 1)
          )}
        </HeaderOrdering>
        {!!pinnedColumns?.rightWidth && (
          <LockedEndWrapper type="header" ref={lockedEndWrapperRef}>
            {pinnedColumns?.rightColumns.map((col, index) =>
              renderColumnHeader(
                col,
                index + ((pinnedColumns?.leftColumns.length ?? 0) + columnsInUse.columns.length) + 1
              )
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
