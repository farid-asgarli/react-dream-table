import { useCallback, useEffect, useMemo, useState } from "react";
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

const CONTEXT_MENU_KEY = "_context-menu-key";
const SELECTION_KEY = "_selection-key";

export function useTableTools<DataType extends Record<string, any>>({
  tableProps,
  styles,
}: {
  tableProps: TableProps<DataType>;
  styles: Record<string, string>;
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

  const [activeRow, setActiveRow] = useState<TableRowKeyType>();
  const [selectedRows, setSelectedRows] = useState<Set<TableRowKeyType>>(
    new Set()
  );
  const [filterMenu, setFilterMenu] = useState<FilterMenuVisibility>();

  const [contextMenu, setContextMenu] =
    useState<ContextMenuVisibility<DataType>>();

  function determineEllipsis(
    column: ColumnType<DataType>,
    propKey?: keyof EllipsisProps | undefined
  ) {
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
      const mappedRows = columns.map((col) => (
        <td
          className={concatStyles(
            determineEllipsis(col, "rowData") && styles.Ellipsis
          )}
          key={col.key}
        >
          {col.dataRender ? col.dataRender(data) : data[col.key]}
        </td>
      ));

      if (renderContextMenu) {
        const contextMenuShortcut = (
          <td key={CONTEXT_MENU_KEY} className={styles.ContextMenuContainer}>
            <button
              type="button"
              title="Menu"
              className={styles.ContextMenuButton}
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
              <MultiDotIcon className={styles.ContextMenuIcon} />
            </button>
          </td>
        );
        mappedRows.push(contextMenuShortcut);
      }

      if (selectionMode === "multiple") {
        const selectionColumn = (
          <td key={SELECTION_KEY}>
            <input
              className={styles.Checkbox}
              onChange={(e) =>
                handleUpdateSelection(data[uniqueRowKey], e.target.checked)
              }
              checked={isRowActive}
              type={"checkbox"}
            />
          </td>
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
    ]
  );
  const handleMapColGroups = useMemo(() => {
    const columnsToMap = columns.map(({ key, width }) => (
      <col key={key} style={{ width }} />
    ));
    if (renderContextMenu)
      columnsToMap.push(<col key={CONTEXT_MENU_KEY} style={{ width: "5%" }} />);
    if (selectionMode === "multiple") {
      const selectionCol = <col key={SELECTION_KEY} />;
      return [selectionCol, ...columnsToMap];
    }
    return columnsToMap;
  }, [columns, selectionMode, renderContextMenu]);

  const handleMapTableHead = useMemo(() => {
    const columnsToRender = columns.map((x) => (
      <th
        className={concatStyles(
          styles.FilterHeader,
          determineEllipsis(x, "columnHead") && styles.Ellipsis
        )}
        key={x.key}
      >
        <div className={concatStyles(x.filter && styles.FilterWrapper)}>
          <div className={styles.Content}>
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
              className={styles.SearchButton}
            >
              <SearchIcon
                className={concatStyles(
                  styles.SearchIcon,
                  selectedFilters[x.key]?.size > 0 && styles.Active
                )}
              />
            </button>
          )}
        </div>
      </th>
    ));

    if (renderContextMenu)
      columnsToRender.push(
        <th className={styles.ContextHeader} key={CONTEXT_MENU_KEY}></th>
      );

    if (selectionMode === "multiple") {
      const selectionColumn = (
        <th key={SELECTION_KEY}>
          <input
            className={styles.Checkbox}
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
        </th>
      );
      return [selectionColumn, ...columnsToRender];
    }
    return columnsToRender;
  }, [columns, data, selectionMode, selectedRows, renderContextMenu]);

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
          <tr
            className={concatStyles(
              (activeRow === x[uniqueRowKey] || isRowActive) && styles.Active
            )}
            onClick={(e) => handleRowClick(e, x[uniqueRowKey])}
            key={i}
          >
            {handleMapRow(x, isRowActive)}
          </tr>
        );
      }),

    [activeRow, data, handleMapRow]
  );

  return {
    handleMapColGroups,
    handleMapData,
    handleMapTableHead,
    handleDisplayContextMenu,
    handleDisplayFilterMenu,
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
  };
}
