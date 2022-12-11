/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  ContextMenuVisibility,
  EllipsisProps,
  FilterMenuVisibility,
  TableHeadDataProps,
  TableRowKeyType,
} from "../types/Utils";
import { concatStyles } from "../utils/ConcatStyles";
import {
  ColumnType,
  InputAlternateFiltering,
  SelectAlternateFiltering,
  TableLocalizationType,
  TableProps,
} from "../types/Table";
import { TableRow } from "../index/TableConstructor/TableRow/TableRow";
import { TableRowData } from "../index/TableConstructor/TableRowData/TableRowData";
import { DefaultTableDimensions } from "../static/dimensions";
import { TableConstans } from "../static/constants";
import { useColumnResizer } from "../hooks/columnResizer";
import { useDataManagement } from "./dataManagement";
import SearchButton from "../components/ui/Buttons/SearchButton/SearchButton";
import ContextMenuButton from "../components/ui/Buttons/ContextMenuButton/ContextMenuButton";
import ExpandButton from "../components/ui/Buttons/ExpandButton/ExpandButton";
import SortButton from "../components/ui/Buttons/SortButton/SortButton";
import Checkbox from "../components/ui/Checkbox/Checkbox";

export function useTableTools<DataType extends Record<string, any>>(tableProps: TableProps<DataType>) {
  const {
    columns,
    data: apiData,
    selectionMode,
    contextMenu: contextMenuProps,
    onRowClick,
    uniqueRowKey,
    serverSide,
    pagination,
    resizableColumns,
    draggableColumns,
    expandableRows,
    sorting,
    filterDisplayStrategy,
    localization,
    changeColumnVisibility,
    tableDimensions,
  } = tableProps;

  const {
    inputValue,
    updateInputValue,
    data,
    paginationProps,
    updatePaginationProps,
    selectedFilters,
    prefetchedFilters,
    pipeFetchedFilters,
    updateSelectedFilters,
    progressReporters,
    sortData,
    currentSortFilter,
    abstractFilters,
    updateTextFilterValue,
    dataWithoutPagination,
  } = useDataManagement<DataType>(serverSide !== undefined ? "server" : "client", {
    columns,
    data: apiData,
    filterDisplayStrategy: filterDisplayStrategy ?? "default",
    dataCount: serverSide?.pagination?.dataCount,
    paginationDefaults: pagination?.defaults,
    serverSide,
    sortingProps: sorting,
  });

  /** List of checked items in the table. */
  const [selectedRows, setSelectedRows] = useState<Set<TableRowKeyType>>(new Set());
  /** Filter menu visibility props. */
  const [filterMenu, setFilterMenu] = useState<FilterMenuVisibility>();
  /** Context menu visibility props. */
  const [contextMenu, setContextMenu] = useState<ContextMenuVisibility<DataType>>();
  /** Set of visible column headers. */
  const [visibleHeaders, setVisibleHeaders] = useState<Set<string>>(
    typeof changeColumnVisibility !== "boolean" && changeColumnVisibility?.defaultVisibleHeaders
      ? changeColumnVisibility?.defaultVisibleHeaders
      : new Set(columns.map((x) => x.key))
  );
  /** Set of column dimensions (e.g. width). */
  const [columnDimensions, setColumnDimensions] = useState<Map<string, number>>(
    new Map(columns.map(({ key, width }) => [key, width ?? tableDimensions?.defaultColumnWidth!]))
  );
  /** Set of column keys in sorted order. */
  const [columnOrder, setColumnOrder] = useState<Array<string>>(
    typeof draggableColumns !== "boolean" && draggableColumns?.defaultColumnOrder
      ? draggableColumns?.defaultColumnOrder
      : columns.map(({ key }) => key)
  );
  /** Set of expanded row keys. */
  const [expandedRowKeys, setExpandedRowKeys] = useState<Set<TableRowKeyType>>(new Set());

  function handleChangeColumnSize(key: string, newWidth: number) {
    setColumnDimensions((prev) => {
      const newState = new Map(prev).set(key, newWidth);
      typeof resizableColumns !== "boolean" && resizableColumns?.onColumnResize?.(newState);
      return newState;
    });
  }

  function handleExpandColumn(key: TableRowKeyType) {
    setExpandedRowKeys((prev) => {
      const stateCopy = new Set(prev);
      if (prev.has(key)) {
        stateCopy.delete(key);
        expandableRows?.onRowShrinked?.(key);
      } else {
        stateCopy.add(key);
        expandableRows?.onRowExpanded?.(key);
      }
      return stateCopy;
    });
  }

  const headerDataRefs = useRef(new Map<string, HTMLDivElement | null>());

  const columnsToRender = useMemo(() => {
    let columnsCopy = [...columns].sort((a, b) => columnOrder.indexOf(a.key) - columnOrder.indexOf(b.key));
    if (contextMenuProps?.render) {
      columnsCopy.push({
        key: TableConstans.CONTEXT_MENU_KEY,
        width: DefaultTableDimensions.contextMenuColumnWidth,
      });
    }

    if (expandableRows) {
      columnsCopy = [
        {
          key: TableConstans.EXPANDABLE_KEY,
          width: DefaultTableDimensions.expandedMenuColumnWidth,
        },
        ...columnsCopy,
      ];
    }

    if (selectionMode) {
      columnsCopy = [
        {
          key: TableConstans.SELECTION_KEY,
          width: DefaultTableDimensions.selectionMenuColumnWidth,
        },
        ...columnsCopy,
      ];
    }
    return columnsCopy.filter(
      (col) =>
        visibleHeaders.has(col.key) ||
        col.key === TableConstans.SELECTION_KEY ||
        col.key === TableConstans.CONTEXT_MENU_KEY ||
        col.key === TableConstans.EXPANDABLE_KEY
    );
  }, [columns, columnOrder, visibleHeaders]);

  function determineEllipsis(column: ColumnType<DataType>, propKey?: keyof EllipsisProps | undefined) {
    if (column.ellipsis === undefined) return true;
    if (typeof column.ellipsis === "boolean") return column.ellipsis === true;
    else if (propKey) return column.ellipsis?.[propKey] === true;
    return false;
  }

  const checkIfColumnIsResizable = useCallback(
    (columnKey: string) => {
      if (!resizableColumns) return false;
      if (typeof resizableColumns === "boolean" && resizableColumns === true) return true;
      else if (!resizableColumns.columnsToExclude?.includes(columnKey)) return true;
    },
    [resizableColumns]
  );

  const checkIfColumnIsDraggable = useCallback(
    (columnKey: string) => {
      if (!draggableColumns) return false;
      if (typeof draggableColumns === "boolean" && draggableColumns === true) return true;
      else if (!draggableColumns.columnsToExclude?.includes(columnKey)) return true;
    },
    [draggableColumns]
  );

  function handleUpdateSelection(value: TableRowKeyType) {
    setSelectedRows((rows) => {
      if (rows.has(value)) {
        const updatedRows = new Set(rows);
        updatedRows.delete(value);
        return updatedRows;
      }
      return new Set(rows).add(value);
    });
  }

  async function handleDisplayFilterMenu(
    prop?: { key: string; position: FilterMenuVisibility["position"] } | undefined,
    visibility: "visible" | "hidden" | "destroy-on-close" = "visible"
  ) {
    if (prop) {
      const { key, position } = prop;

      if (position) {
        setFilterMenu((prev) => ({
          key,
          visible: true,
          position:
            prev?.key === key
              ? prev.position
              : {
                  xAxis: position.xAxis - 50,
                  yAxis: position.yAxis + 20,
                },
        }));
      }
      await pipeFetchedFilters(key);
      return;
    }
    switch (visibility) {
      case "hidden":
        setFilterMenu((prev) => ({ ...prev, visible: false }));
        break;
      case "destroy-on-close":
        setFilterMenu(undefined);
    }
  }

  function handleDisplayContextMenu(
    prop?:
      | {
          data: DataType;
          position: ContextMenuVisibility<DataType>["position"];
        }
      | undefined,
    visibility: "visible" | "hidden" | "destroy-on-close" = "visible",
    overridePreviousPosition: boolean = false
  ) {
    if (prop && visibility === "visible") {
      const { data, position } = prop;
      if (position) {
        setContextMenu((prev) => {
          const prevId = prev?.data?.[uniqueRowKey];
          const currentId = data[uniqueRowKey];
          return {
            data,
            position:
              !overridePreviousPosition && prevId === currentId
                ? prev?.position
                : {
                    xAxis: position.xAxis,
                    yAxis: position.yAxis,
                  },
            visible: prevId !== currentId || !prev?.visible,
          };
        });
      }
      return;
    }
    switch (visibility) {
      case "hidden":
        setContextMenu((prev) => ({ ...prev, visible: false }));
        break;
      case "destroy-on-close":
        setContextMenu(undefined);
    }
  }

  const handleMapRow = useCallback(
    (data: DataType, isRowActive: boolean) => {
      const mappedRows = columnsToRender.map((col, index) => {
        function conditionalRenderIfNullOrEmpty(data: any) {
          if (col.dataRenderOnNullOrUndefined && (data === null || data === undefined))
            return col.dataRenderOnNullOrUndefined(data);
          return data;
        }

        const tableRowDataProps = {
          key: col.key,
          rowProps: { width: col.width },
          tabIndex: index,
          role: "cell",
        };

        switch (col.key) {
          case TableConstans.CONTEXT_MENU_KEY:
            return (
              <TableRowData className="context-menu-container" {...tableRowDataProps}>
                <ContextMenuButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDisplayContextMenu({
                      data,
                      position: {
                        xAxis: e.clientX,
                        yAxis: e.clientY,
                      },
                    });
                  }}
                />
              </TableRowData>
            );
          case TableConstans.EXPANDABLE_KEY:
            return (
              <TableRowData className="expandable-container" {...tableRowDataProps}>
                {(!expandableRows?.excludeWhen || !expandableRows.excludeWhen(data)) && (
                  <ExpandButton
                    isExpanded={expandedRowKeys.has(data[uniqueRowKey])}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExpandColumn(data[uniqueRowKey]);
                    }}
                    title={
                      expandedRowKeys.has(data[uniqueRowKey])
                        ? localization?.rowShrinkTitle
                        : localization?.rowExpandTitle
                    }
                  />
                )}
              </TableRowData>
            );
          case TableConstans.SELECTION_KEY:
            return (
              <TableRowData className="select-input-container" {...tableRowDataProps}>
                <Checkbox
                  onChange={selectionMode === "default" ? (e) => handleUpdateSelection(data[uniqueRowKey]) : undefined}
                  readOnly={selectionMode === "onRowClick"}
                  checked={isRowActive}
                />
              </TableRowData>
            );
          default:
            return (
              <TableRowData
                className={concatStyles(determineEllipsis(col, "rowData") && "ellipsis")}
                {...tableRowDataProps}
                rowProps={{
                  width: columnDimensions.get(col.key),
                }}
              >
                {col.dataRender ? col.dataRender(data) : conditionalRenderIfNullOrEmpty(data[col.key])}
              </TableRowData>
            );
        }
      });

      return mappedRows;
    },

    [
      columnsToRender,
      contextMenuProps,
      selectedRows,
      selectionMode,
      contextMenu,
      uniqueRowKey,
      columnDimensions,
      expandedRowKeys,
    ]
  );

  //#region Column-Resize

  const { activeIndex, mouseDown } = useColumnResizer(
    {
      headerDataRefs: headerDataRefs.current,
      handleChangeColumnSize,
      minColumnResizeWidth: tableDimensions?.minColumnResizeWidth,
      maxColumnResizeWidth: tableDimensions?.maxColumnResizeWidth,
    },
    // Enable column resizing if only 'true' or 'props' are passed as an arg.
    !!resizableColumns
  );
  //#endregion

  const handleMapTableHead: Array<TableHeadDataProps> = useMemo(
    () =>
      columnsToRender.map((col) => {
        let tableHeadProps: TableHeadDataProps & { key: string } = {
          key: col.key,
          columnKey: col.key,
          rowProps: { width: col.width },
        };
        switch (col.key) {
          case TableConstans.SELECTION_KEY:
            const selectionHeadProps: TableHeadDataProps = {
              ...tableHeadProps,
              className: "select-header",
              children: (
                <Checkbox
                  onChange={(e) =>
                    setSelectedRows(
                      !e.target.checked ? new Set() : new Set(dataWithoutPagination!.map((x) => x[uniqueRowKey]))
                    )
                  }
                  // checked={dataWithoutPagination?.length !== 0 && dataWithoutPagination?.length === selectedRows.size}
                  checked={paginationProps.dataCount !== 0 && paginationProps.dataCount === selectedRows.size}
                />
              ),
            };
            return selectionHeadProps;
          case TableConstans.CONTEXT_MENU_KEY:
            const contextHeadProps: TableHeadDataProps = {
              ...tableHeadProps,
              className: "context-header",
            };

            return contextHeadProps;
          case TableConstans.EXPANDABLE_KEY:
            const expandableProps: TableHeadDataProps = { ...tableHeadProps, className: "expandable-header" };
            return expandableProps;
          default:
            const dataProps: TableHeadDataProps & React.RefAttributes<HTMLDivElement> = {
              ...tableHeadProps,
              className: concatStyles(determineEllipsis(col, "columnHead") && "ellipsis", "filter-header"),
              children: (
                <div className={concatStyles(col.filter && "filter-wrapper")}>
                  <div className={concatStyles(determineEllipsis(col, "columnHead") && "ellipsis", "content")}>
                    {col.columnRender ? col.columnRender() : col.title}
                  </div>
                </div>
              ),
              ref: (ref: HTMLDivElement | null) => headerDataRefs.current.set(col.key, ref),
              resizingProps: {
                onMouseDown: mouseDown,
                activeIndex,
                isResizable: checkIfColumnIsResizable(col.key),
              },
              draggingProps: {
                isDraggable: checkIfColumnIsDraggable(col.key),
              },
              rowProps: {
                width: columnDimensions.get(col.key),
              },
              alternateFilterInputProps:
                col.filter && filterDisplayStrategy === "alternative"
                  ? {
                      handleChangeFilterInput: updateTextFilterValue,
                      currentValue: abstractFilters[col.key],
                      fetchFilters: pipeFetchedFilters,
                      prefetchedFilters: prefetchedFilters,
                      type: col.filteringProps?.alternate?.type,
                      render: (col.filteringProps?.alternate as SelectAlternateFiltering)?.render,
                      multiple: (col.filteringProps?.alternate as SelectAlternateFiltering)?.multipleSelection,
                      progressReporters: progressReporters,
                      searchInputProps: (col.filteringProps?.alternate as InputAlternateFiltering)?.searchInputProps,
                      renderCustomInput: (col.filteringProps?.alternate as InputAlternateFiltering)?.renderCustomInput,
                    }
                  : undefined,
              toolBoxes: [
                col.sort ? (
                  <SortButton
                    sortingDirection={currentSortFilter?.key === col.key ? currentSortFilter?.direction : undefined}
                    key={`${col.key}_sort`}
                    onClick={() => sortData(col.key)}
                    localization={localization as TableLocalizationType}
                  />
                ) : undefined,
                col.filter && filterDisplayStrategy !== "alternative" ? (
                  <SearchButton
                    key={`${col.key}_search`}
                    isActive={selectedFilters[col.key] && selectedFilters[col.key]!.size > 0}
                    isVisible={filterMenu?.key === col.key && filterMenu.visible}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDisplayFilterMenu({
                        key: col.key,
                        position: {
                          xAxis: e.clientX,
                          yAxis: e.clientY,
                        },
                      });
                    }}
                  />
                ) : undefined,
              ],
            };
            return dataProps;
        }
      }),
    [data, selectedRows, currentSortFilter, columnsToRender, columnDimensions, prefetchedFilters, progressReporters]
  );

  const handleRowClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>, rowKey: TableRowKeyType) => {
      e.stopPropagation();
      if (selectionMode === "onRowClick") handleUpdateSelection(rowKey);
      onRowClick?.(e, rowKey);
    },
    [selectionMode, onRowClick]
  );

  const handleMapData = useMemo(
    () =>
      data?.map((x, i) => {
        const isRowActive = selectedRows.has(x[uniqueRowKey]);
        const isRowExpanded = expandedRowKeys.has(x[uniqueRowKey]);
        return (
          <TableRow
            className={concatStyles(isRowActive && "active")}
            onClick={(e) => handleRowClick(e, x[uniqueRowKey])}
            onContextMenu={
              contextMenuProps?.displayOnRightClick === false
                ? undefined
                : (e) => {
                    e.preventDefault();
                    handleDisplayContextMenu(
                      {
                        data: x,
                        position: {
                          xAxis: e.clientX,
                          yAxis: e.clientY,
                        },
                      },
                      undefined,
                      true
                    );
                  }
            }
            expandedProps={{
              isRowExpanded: isRowExpanded,
              children: expandableRows?.render?.(x),
              showSeperatorLine: !expandableRows?.showSeperatorLine || expandableRows?.showSeperatorLine === true,
            }}
            key={i}
          >
            {handleMapRow(x, isRowActive)}
          </TableRow>
        );
      }),

    [data, expandedRowKeys, handleMapRow]
  );

  function handleHeaderVisibility(key: string) {
    const visibleHeadersCopy = new Set(visibleHeaders);

    if (visibleHeadersCopy.size > 1 && visibleHeadersCopy.has(key)) {
      visibleHeadersCopy.delete(key);

      const columnSelectedFilters = selectedFilters[key];
      if (columnSelectedFilters && columnSelectedFilters.size > 0) updateSelectedFilters(key);
    } else visibleHeadersCopy.add(key);

    setVisibleHeaders(visibleHeadersCopy);

    return visibleHeadersCopy;
  }

  useEffect(() => {
    if (headerDataRefs.current.size === 0 && resizableColumns) {
      headerDataRefs.current = new Map(headerDataRefs.current);
    }
  }, [headerDataRefs.current]);

  return {
    handleMapData,
    handleMapTableHead,
    handleDisplayContextMenu,
    handleDisplayFilterMenu,
    handleHeaderVisibility,
    contextMenu,
    filterMenu,
    paginationProps,
    selectedFilters,
    selectedRows,
    updateInputValue,
    updateSelectedFilters,
    updatePaginationProps,
    prefetchedFilters,
    inputValue,
    progressReporters,
    data,
    visibleHeaders,
    handleChangeColumnSize,
    columnDimensions,
    headerDataRefs,
    setColumnOrder,
    columnsToRender,
    dataWithoutPagination,
    setColumnDimensions,
  };
}
