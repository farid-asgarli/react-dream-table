import { useCallback, useState } from "react";
import { ColumnType, KeyLiteralType, TableProps } from "../types/Table";
import { ContextMenuVisibility, TableRowKeyType } from "../types/Utils";
import { arrayToObject } from "../utils/ColumnArrayToRecord";
import { useDataManagement } from "./dataManagement";

export default function useTableTools<DataType>({
  columns,
  tableProps: tp,
}: {
  columns: ColumnType<DataType>[];
  tableProps: TableProps<DataType>;
}) {
  /** Set of column dimensions (e.g. width). */
  const [columnDimensions, setColumnDimensions] = useState<Record<KeyLiteralType<DataType>, number>>(
    arrayToObject(columns, (col) => col.width) as Record<KeyLiteralType<DataType>, number>
  );
  /** Context menu visibility props. */
  const [contextMenu, setContextMenu] = useState<ContextMenuVisibility<DataType>>();
  /** Set of visible column headers. */
  const [visibleColumns, setVisibleColumns] = useState<Set<KeyLiteralType<DataType>>>(
    tp.columnVisibilityOptions?.active && tp.columnVisibilityOptions?.defaultVisibleHeaders
      ? new Set(tp.columnVisibilityOptions.defaultVisibleHeaders)
      : new Set(columns.map((x) => x.key))
  );

  /** Set of column keys in sorted order. */
  const [columnOrder, setColumnOrder] = useState<Array<KeyLiteralType<DataType>>>(
    tp.draggableColumns?.active && tp.draggableColumns?.defaultColumnOrder
      ? tp.draggableColumns.defaultColumnOrder
      : columns.map(({ key }) => key)
  );

  /** List of checked items in the table. */
  const [selectedRows, setSelectedRows] = useState<Set<TableRowKeyType>>(new Set());

  const [expandedRowKeys, setExpandedRowKeys] = useState<Set<TableRowKeyType>>(new Set());

  const [settingsMenuVisibility, setSettingsMenuVisibility] = useState<{
    visible: boolean;
    position:
      | {
          x: number;
          y: number;
        }
      | undefined;
  }>();

  const [pinnedColumns, setPinnedColumns] = useState<{
    left: Array<KeyLiteralType<DataType>>;
    right: Array<KeyLiteralType<DataType>>;
  }>({ left: tp.pinnedColumns?.left ?? [], right: tp.pinnedColumns?.right ?? [] });

  function displaySettingsMenu(e: React.MouseEvent<HTMLButtonElement>) {
    setSettingsMenuVisibility({
      visible: true,
      position: {
        x: e.clientX,
        y: e.clientY - 280,
      },
    });
  }

  function hideSettingsMenu() {
    setSettingsMenuVisibility((prev) => ({
      visible: false,
      position: prev?.position,
    }));
  }

  const dataTools = useDataManagement<DataType>(tp.serverSide !== undefined ? "server" : "client", {
    columns,
    data: tp.data,
    dataCount: tp.serverSide?.pagination?.dataCount,
    paginationDefaults: tp.pagination?.defaults,
    serverSide: tp.serverSide,
    sortingProps: tp.sorting,
  });

  function handleChangeColumnSize(key: string, newWidth: number) {
    setColumnDimensions((prev) => ({ ...prev, [key]: newWidth }));
  }

  function handleColumnVisibility(key: string) {
    const visibleColumnsCopy = new Set(visibleColumns);

    if (visibleColumnsCopy.size > 1 && visibleColumnsCopy.has(key)) {
      visibleColumnsCopy.delete(key);
    } else visibleColumnsCopy.add(key);

    tp.columnVisibilityOptions?.onVisibilityChange?.(Array.from(visibleColumnsCopy));

    setVisibleColumns(visibleColumnsCopy);
    return visibleColumnsCopy;
  }

  function handlePinColumn(colKey: string, position: keyof typeof pinnedColumns) {
    let newState = { ...pinnedColumns };

    const currentPosition = pinnedColumns["left"].includes(colKey)
      ? "left"
      : pinnedColumns["right"].includes(colKey)
      ? "right"
      : undefined;

    if (currentPosition === position) {
      newState[position] = [...newState[position].filter((x) => x !== colKey)];
    } else if (currentPosition === undefined) {
      newState[position] = [...newState[position], colKey];
    } else {
      newState[currentPosition] = [...newState[currentPosition].filter((x) => x !== colKey)];
      newState[position] = [...newState[position], colKey];
    }
    setPinnedColumns(newState);
  }

  function handleExpandRow(key: TableRowKeyType) {
    setExpandedRowKeys((prev) => {
      const stateCopy = new Set(prev);
      if (prev.has(key)) {
        stateCopy.delete(key);
        tp.expandableRows?.onRowShrinked?.(key);
      } else {
        stateCopy.add(key);
        tp.expandableRows?.onRowExpanded?.(key);
      }
      return stateCopy;
    });
  }

  const checkIfColumnIsResizable = useCallback(
    (columnKey: KeyLiteralType<DataType>) => {
      if (!tp.resizableColumns?.active) return false;
      else if (!tp.resizableColumns.columnsToExclude?.includes(columnKey)) return true;
    },
    [tp.resizableColumns]
  );

  const checkIfColumnIsDraggable = useCallback(
    (columnKey: KeyLiteralType<DataType>) => {
      if (!tp.draggableColumns?.active) return false;
      else if (!tp.draggableColumns.columnsToExclude?.includes(columnKey)) return true;
    },
    [tp.draggableColumns]
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

  function hideContextMenu(destroyOnClose: boolean = false) {
    setContextMenu((prev) => (!destroyOnClose ? { ...prev, visible: false } : undefined));
  }

  function displayContextMenu(
    prop: {
      data: DataType;
      position: ContextMenuVisibility<DataType>["position"];
    },
    overridePreviousPosition: boolean = false,
    area: "header" | "body" = "body"
  ) {
    const { data, position } = prop;
    if (position) {
      setContextMenu((prev) => {
        let prevId;
        let currentId;
        if (area === "body") {
          prevId = prev?.area === "body" ? prev?.data?.[tp.uniqueRowKey as keyof DataType] : null;
          currentId = data?.[tp.uniqueRowKey as keyof DataType];
        } else {
          type HeaderMenuData = { id: KeyLiteralType<DataType> };
          prevId = prev?.area === "header" ? (prev?.data as HeaderMenuData)?.["id"] : null;
          currentId = (data as HeaderMenuData)?.["id"];
        }

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
          area,
        };
      });
    }
    return;
  }

  const handleRowClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>, cellData: DataType) => {
      e.stopPropagation();
      if (tp.selectableRows?.active && tp.selectableRows?.type === "onRowClick")
        handleUpdateSelection(cellData[tp.uniqueRowKey as keyof DataType] as TableRowKeyType);
      tp.onRowClick?.(e, cellData);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tp.selectableRows]
  );

  return {
    dataTools,
    contextMenu,
    columnOrder,
    columnDimensions,
    visibleColumns,
    selectedRows,
    expandedRowKeys,
    settingsMenuVisibility,
    pinnedColumns,
    handlePinColumn,
    hideSettingsMenu,
    displaySettingsMenu,
    setColumnOrder,
    setColumnDimensions,
    handleRowClick,
    handleExpandRow,
    handleChangeColumnSize,
    handleColumnVisibility,
    displayContextMenu,
    hideContextMenu,
    checkIfColumnIsDraggable,
    checkIfColumnIsResizable,
    setSelectedRows,
    handleUpdateSelection,
  };
}
