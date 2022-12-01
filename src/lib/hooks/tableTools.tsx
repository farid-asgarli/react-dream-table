/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useMemo, useState } from "react";
import type {
  ContextMenuVisibility,
  EllipsisProps,
  FilterMenuVisibility,
  TableRowKeyType,
} from "../types/Utils";
import MultiDotIcon from "../icons/MultiDot";
import SearchIcon from "../icons/Search";
import { useFilterManagement } from "./filterManagement";
import { concatStyles } from "../utils/ConcatStyles";
import { ColumnType, TableProps } from "../types/Table";
import { TableHeadData } from "../index/TableConstructor/TableHeadData/TableHeadData";
import { TableRow } from "../index/TableConstructor/TableRow/TableRow";
import { TableRowData } from "../index/TableConstructor/TableRowData/TableRowData";
import { TableMeasures } from "../static/measures";

const CONTEXT_MENU_KEY = "_context-menu-key";
const SELECTION_KEY = "_selection-key";

export function useTableTools<DataType extends Record<string, any>>({
  tableProps,
}: {
  tableProps: TableProps<DataType>;
}) {
  const {
    columns,
    data: apiData,
    isRowClickable,
    selectionMode,
    renderContextMenu,
    onRowClick,
    uniqueRowKey,
    serverSide,
    paginationDefaults,
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
  } = useFilterManagement<DataType>(
    columns,
    apiData,
    serverSide,
    paginationDefaults
  );

  const contextMenuColumnWidth = TableMeasures.contextMenuColumnWidth;
  const selectionMenuColumnWidth = TableMeasures.selectionMenuColumnWidth;

  const [activeRow, setActiveRow] = useState<TableRowKeyType>();
  const [selectedRows, setSelectedRows] = useState<Set<TableRowKeyType>>(
    new Set()
  );
  const [filterMenu, setFilterMenu] = useState<FilterMenuVisibility>();

  const [contextMenu, setContextMenu] =
    useState<ContextMenuVisibility<DataType>>();

  const [visibleHeaders, setVisibleHeaders] = useState<Set<string>>(
    new Set(columns.map((x) => x.key))
  );

  const columnsToRender = columns.filter((col) => visibleHeaders.has(col.key));

  function determineEllipsis(
    column: ColumnType<DataType>,
    propKey?: keyof EllipsisProps | undefined
  ) {
    if (column.ellipsis === undefined) return true;
    if (typeof column.ellipsis === "boolean") return column.ellipsis === true;
    else if (propKey) return column.ellipsis?.[propKey] === true;
    return false;
  }

  function handleUpdateSelection(value: TableRowKeyType, event: boolean) {
    if (event === false)
      setSelectedRows((rows) => {
        const updatedRows = new Set(rows);
        updatedRows.delete(value);
        return updatedRows;
      });
    else setSelectedRows((rows) => new Set(rows).add(value));
  }

  async function handleDisplayFilterMenu(
    prop?:
      | { key: string; position: FilterMenuVisibility["position"] }
      | undefined,
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
          if (
            col.dataRenderOnNullOrUndefined &&
            (data === null || data === undefined)
          )
            return col.dataRenderOnNullOrUndefined(data);
          return data;
        }

        return (
          <TableRowData
            className={concatStyles(
              determineEllipsis(col, "rowData") && "ellipsis"
            )}
            key={col.key}
            rowProps={{
              width: col.width ?? TableMeasures.defaultColumnWidth,
            }}
          >
            {col.dataRender
              ? col.dataRender(data)
              : conditionalRenderIfNullOrEmpty(data[col.key])}
          </TableRowData>
        );
      });

      if (renderContextMenu) {
        const contextMenuShortcut = (
          <TableRowData
            key={CONTEXT_MENU_KEY}
            className={"context-menu-container"}
            rowProps={{
              width: contextMenuColumnWidth,
            }}
          >
            <button
              type="button"
              title="Menu"
              className={"context-menu-button"}
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
            >
              <MultiDotIcon className={"context-menu-icon"} />
            </button>
          </TableRowData>
        );
        mappedRows.push(contextMenuShortcut);
      }

      if (selectionMode === "multiple") {
        const selectionColumn = (
          <TableRowData
            key={SELECTION_KEY}
            rowProps={{
              width: selectionMenuColumnWidth,
            }}
          >
            <input
              className={"checkbox"}
              onChange={(e) =>
                handleUpdateSelection(data[uniqueRowKey], e.target.checked)
              }
              checked={isRowActive}
              type={"checkbox"}
            />
          </TableRowData>
        );
        return [selectionColumn, ...mappedRows];
      }
      return mappedRows;
    },

    [
      columns,
      renderContextMenu,
      selectedRows,
      selectionMode,
      contextMenu,
      uniqueRowKey,
      visibleHeaders,
    ]
  );

  const handleMapTableHead = useMemo(() => {
    const colsToRender = columnsToRender.map((x) => (
      <TableHeadData
        className={concatStyles(
          "filter-header",
          determineEllipsis(x, "columnHead") && "ellipsis"
        )}
        key={x.key}
        rowProps={{
          width: x.width ?? TableMeasures.defaultColumnWidth,
        }}
      >
        <div className={concatStyles(x.filter && "filter-wrapper")}>
          <div className={"content"}>
            {x.columnRender ? x.columnRender() : x.title}
          </div>
          {x.filter && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDisplayFilterMenu({
                  key: x.key,
                  position: {
                    xAxis: e.clientX,
                    yAxis: e.clientY,
                  },
                });
              }}
              type="button"
              title="Filter"
              className={"search-button"}
            >
              <SearchIcon
                className={concatStyles(
                  "search-icon",
                  selectedFilters[x.key]?.size > 0 && "active"
                )}
              />
            </button>
          )}
        </div>
      </TableHeadData>
    ));

    if (renderContextMenu)
      colsToRender.push(
        <TableHeadData
          className={"context-header"}
          key={CONTEXT_MENU_KEY}
          rowProps={{ width: contextMenuColumnWidth }}
        />
      );

    if (selectionMode === "multiple") {
      const selectionColumn = (
        <TableHeadData
          rowProps={{ width: selectionMenuColumnWidth }}
          key={SELECTION_KEY}
        >
          <input
            className={"checkbox"}
            onChange={(e) =>
              setSelectedRows(
                !e.target.checked
                  ? new Set()
                  : new Set(data!.map((x) => x[uniqueRowKey]))
              )
            }
            checked={data?.length === selectedRows.size}
            type={"checkbox"}
          />
        </TableHeadData>
      );
      return [selectionColumn, ...colsToRender];
    }
    return colsToRender;
  }, [
    columns,
    data,
    selectionMode,
    selectedRows,
    renderContextMenu,
    visibleHeaders,
  ]);

  const handleRowClick = useCallback(
    (
      e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
      rowKey: TableRowKeyType
    ) => {
      if (isRowClickable) {
        if (selectionMode !== "multiple")
          setActiveRow((prev) => (prev === rowKey ? undefined : rowKey));
        onRowClick?.(e, rowKey);
      }
    },
    [isRowClickable, selectionMode, onRowClick]
  );

  const handleMapData = useMemo(
    () =>
      data?.map((x, i) => {
        const isRowActive = selectedRows.has(x[uniqueRowKey]);
        return (
          <TableRow
            className={concatStyles(
              (activeRow === x[uniqueRowKey] || isRowActive) && "active"
            )}
            onClick={(e: any) => handleRowClick(e, x[uniqueRowKey])}
            key={i}
          >
            {handleMapRow(x, isRowActive)}
          </TableRow>
        );
      }),

    [activeRow, data, handleMapRow]
  );

  function handleHeaderVisibility(key: string) {
    const visibleHeadersCopy = new Set(visibleHeaders);

    if (visibleHeadersCopy.size > 1 && visibleHeadersCopy.has(key)) {
      visibleHeadersCopy.delete(key);

      const columnSelectedFilters = selectedFilters[key];
      if (columnSelectedFilters && columnSelectedFilters.size > 0)
        updateSelectedFilters(key);
    } else visibleHeadersCopy.add(key);

    setVisibleHeaders(visibleHeadersCopy);

    return visibleHeadersCopy;
  }

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
  };
}
