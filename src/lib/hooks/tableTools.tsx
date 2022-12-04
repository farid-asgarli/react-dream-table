/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  ContextMenuVisibility,
  EllipsisProps,
  FilterMenuVisibility,
  TableHeadDataProps,
  TableRowKeyType,
} from "../types/Utils";
import { useFilterManagement } from "./filterManagement";
import { concatStyles } from "../utils/ConcatStyles";
import { ColumnType, TableProps } from "../types/Table";
import { TableRow } from "../index/TableConstructor/TableRow/TableRow";
import { TableRowData } from "../index/TableConstructor/TableRowData/TableRowData";
import { TableDimensions } from "../static/measures";
import { TableConstans } from "../static/constants";
import { useColumnResizer } from "./columnResizer";
import SearchButton from "../components/ui/Buttons/SearchButton/SearchButton";
import ContextMenuButton from "../components/ui/Buttons/ContextMenuButton/ContextMenuButton";
import ExpandButton from "../components/ui/Buttons/ExpandButton/ExpandButton";
import SortButton from "../components/ui/Buttons/SortButton/SortButton";

export function useTableTools<DataType extends Record<string, any>>({
  tableProps,
}: {
  tableProps: TableProps<DataType>;
}) {
  const {
    columns,
    data: apiData,
    selectionMode,
    renderContextMenu,
    onRowClick,
    uniqueRowKey,
    serverSide,
    pagination,
    resizableColumns,
    draggableColumns,
    expandableRows,
    sorting,
  } = tableProps;

  const {
    inputValue,
    updateInputValue,
    data,
    paginationProps,
    updatePaginationProps,
    selectedFilters,
    fetchedFilters,
    pipeFetchedFilters,
    updateSelectedFilters,
    fetching,
    sortData,
    sortFilter,
  } = useFilterManagement<DataType>(columns, apiData, serverSide, pagination?.defaults, sorting);

  /** List of checked items in the table. */
  const [selectedRows, setSelectedRows] = useState<Set<TableRowKeyType>>(new Set());
  /** Filter menu visibility props. */
  const [filterMenu, setFilterMenu] = useState<FilterMenuVisibility>();
  /** Context menu visibility props. */
  const [contextMenu, setContextMenu] = useState<ContextMenuVisibility<DataType>>();
  /** Set of visible column headers. */
  const [visibleHeaders, setVisibleHeaders] = useState<Set<string>>(new Set(columns.map((x) => x.key)));
  /** Set of column dimensions (e.g. width). */
  const [columnDimensions, setColumnDimensions] = useState<Map<string, number>>(
    new Map(columns.map(({ key, width }) => [key, width ?? TableDimensions.defaultColumnWidth]))
  );
  /** Set of column keys in sorted order. */
  const [columnOrder, setColumnOrder] = useState<Array<string>>(columns.map(({ key }) => key));
  /** Set of expanded row keys. */
  const [expandedRowKeys, setExpandedRowKeys] = useState<Set<TableRowKeyType>>(new Set());

  function handleChangeColumnSize(key: string, newWidth: number) {
    setColumnDimensions((prev) => new Map(prev).set(key, newWidth));
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
    if (renderContextMenu) {
      columnsCopy.push({
        key: TableConstans.CONTEXT_MENU_KEY,
        width: TableDimensions.contextMenuColumnWidth,
      });
    }

    if (expandableRows) {
      columnsCopy = [
        {
          key: TableConstans.EXPANDABLE_KEY,
          width: TableDimensions.expandedMenuColumnWidth,
        },
        ...columnsCopy,
      ];
    }

    if (selectionMode === "multiple") {
      columnsCopy = [
        {
          key: TableConstans.SELECTION_KEY,
          width: TableDimensions.selectionMenuColumnWidth,
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
    visibility: "visible" | "hidden" | "destroy-on-close" = "visible"
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
              prevId === currentId
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
      const mappedRows = columnsToRender.map((col) => {
        function conditionalRenderIfNullOrEmpty(data: any) {
          if (col.dataRenderOnNullOrUndefined && (data === null || data === undefined))
            return col.dataRenderOnNullOrUndefined(data);
          return data;
        }

        const tableRowDataProps = {
          key: col.key,
          rowProps: { width: col.width },
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
                  />
                )}
              </TableRowData>
            );
          case TableConstans.SELECTION_KEY:
            return (
              <TableRowData {...tableRowDataProps}>
                <input
                  className={"checkbox"}
                  onChange={(e) => handleUpdateSelection(data[uniqueRowKey])}
                  checked={isRowActive}
                  type={"checkbox"}
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
      renderContextMenu,
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
      minColumnResizeWidth: typeof resizableColumns === "boolean" ? undefined : resizableColumns?.minColumnResizeWidth,
      maxColumnResizeWidth: typeof resizableColumns === "boolean" ? undefined : resizableColumns?.maxColumnResizeWidth,
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
            return {
              ...tableHeadProps,
              className: "select-header",
              children: (
                <input
                  className={"checkbox"}
                  onChange={(e) =>
                    setSelectedRows(!e.target.checked ? new Set() : new Set(data!.map((x) => x[uniqueRowKey])))
                  }
                  checked={data?.length === selectedRows.size}
                  type={"checkbox"}
                />
              ),
            };
          case TableConstans.CONTEXT_MENU_KEY:
            return { ...tableHeadProps, className: "context-header" };
          case TableConstans.EXPANDABLE_KEY:
            return { ...tableHeadProps, className: "expandable-header" };
          default:
            return {
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
              toolBoxes: [
                col.sort ? (
                  <SortButton
                    sortingDirection={sortFilter?.key === col.key ? sortFilter?.direction : undefined}
                    key={`${col.key}_sort`}
                    onClick={() => sortData(col.key)}
                  />
                ) : undefined,
                col.filter ? (
                  <SearchButton
                    key={`${col.key}_search`}
                    isActive={selectedFilters[col.key]?.size > 0}
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
        }
      }),
    [data, selectedRows, sortFilter, columnsToRender, columnDimensions]
  );

  const handleRowClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>, rowKey: TableRowKeyType) => {
      if (selectionMode === "multiple") {
        handleUpdateSelection(rowKey);
      }
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
            expandedProps={{
              isRowExpanded: isRowExpanded,
              children: expandableRows?.render?.(x),
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
    fetchedFilters,
    inputValue,
    fetching,
    data,
    visibleHeaders,
    handleChangeColumnSize,
    columnDimensions,
    headerDataRefs,
    setColumnOrder,
  };
}
