import { useCallback, useMemo } from "react";
import { ColumnType, InputFiltering, TableProps } from "../../types/Table";
import { TableRowKeyType } from "../../types/Utils";
import useActiveRow from "./active-row";
import useColumnDimensions from "./column-dimensions";
import useColumnOrder from "./column-order";
import useExpandedRows from "./expanded-rows";
import usePinnedColumns from "./pinned-columns";
import useSelectedRows from "./selected-rows";
import useVisibleColumns from "./visible-columns";

export default function useTableTools<DataType>({
  columns,
  tableProps: tp,
}: {
  columns: ColumnType<DataType>[];
  tableProps: TableProps<DataType>;
}) {
  const checkIfColumnIsResizable = useCallback(
    (columnKey: string) => {
      if (!tp.resizableColumns?.active) return false;
      else if (!tp.resizableColumns.columnsToExclude?.includes(columnKey)) return true;
    },
    [tp.resizableColumns]
  );

  const checkIfColumnIsDraggable = useCallback(
    (columnKey: string) => {
      if (!tp.draggableColumns?.active) return false;
      else if (!tp.draggableColumns.columnsToExclude?.includes(columnKey)) return true;
    },
    [tp.draggableColumns]
  );

  const checkIfFilterFnIsActive = useCallback(
    (columnKey: string) => {
      const column = tp.columns.find((col) => col.key === columnKey);
      return (
        column?.filter &&
        (!column?.filteringProps?.type || ["text", "date", "number"].includes(column?.filteringProps?.type)) &&
        (column as InputFiltering)?.enableFilterFns !== false
      );
    },
    [tp.columns]
  );

  const checkIfHeaderMenuActive = useMemo(
    () => tp.headerActionsMenu?.active === undefined || tp.headerActionsMenu?.active === true,
    [tp.headerActionsMenu]
  );

  const selectedRowProps = useSelectedRows(tp);
  const activeRowProps = useActiveRow();

  const onRowClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>, cellData: DataType) => {
      e.stopPropagation();
      if (tp.selectableRows?.active && tp.selectableRows?.type === "onRowClick")
        selectedRowProps.updateSelectedRows(cellData[tp.uniqueRowKey as keyof DataType] as TableRowKeyType);
      else activeRowProps.updateActiveRow(cellData[tp.uniqueRowKey as keyof DataType] as string);
      tp.onRowClick?.(e, cellData);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tp.selectableRows]
  );

  return {
    checkIfColumnIsDraggable,
    checkIfColumnIsResizable,
    checkIfFilterFnIsActive,
    checkIfHeaderMenuActive,
    onRowClick,
    ...useColumnDimensions(columns),
    ...useColumnOrder(tp),
    ...useExpandedRows(tp),
    ...usePinnedColumns(tp),
    ...useVisibleColumns(tp),
    ...activeRowProps,
    ...selectedRowProps,
  };
}
