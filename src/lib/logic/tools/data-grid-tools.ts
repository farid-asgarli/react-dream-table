import { useCallback, useMemo } from "react";
import { InputFiltering, DataGridProps, DataGridDimensionsDefinition } from "../../types/DataGrid";
import { GridDataType } from "../../types/Utils";
import useActiveHeaders from "./active-header";
import useActiveRow from "./active-row";
import useColumnDimensions from "./column-dimensions";
import useColumnOrder from "./column-order";
import useExpandedRows from "./expanded-rows";
import useGridFeatures from "./grid-features";
import usePinnedColumns from "./pinned-columns";
import useSelectedRows from "./selected-rows";
import useVisibleColumns from "./visible-columns";

export default function useDataGridTools<DataType extends GridDataType>({
  tableProps: gridProps,
  dimensions,
}: {
  tableProps: DataGridProps<DataType>;
  dimensions: DataGridDimensionsDefinition;
}) {
  const isColumnIsResizable = useCallback(
    (columnKey: string) => {
      if (!gridProps.resizableColumns?.enabled) return false;
      else if (!gridProps.resizableColumns.columnsToExclude?.includes(columnKey)) return true;
    },
    [gridProps.resizableColumns]
  );

  const isColumnIsDraggable = useCallback(
    (columnKey: string) => {
      if (!gridProps.draggableColumns?.enabled) return false;
      else if (!gridProps.draggableColumns.columnsToExclude?.includes(columnKey)) return true;
    },
    [gridProps.draggableColumns]
  );

  const isFilterFnIsActive = useCallback(
    (columnKey: string) => {
      if (gridProps.filterFnsMenu?.enabled === false) return false;
      const column = gridProps.columns.find((col) => col.key === columnKey);
      return (
        column?.filter &&
        (!column?.filteringProps?.type || ["text", "date", "number"].includes(column?.filteringProps?.type)) &&
        (column as InputFiltering)?.enableFilterFns !== false
      );
    },
    [gridProps.columns, gridProps.filterFnsMenu?.enabled]
  );

  const isVirtualizationIsEnabled = useMemo(() => gridProps.virtualization?.enabled === true, [gridProps.virtualization?.enabled]);

  const isColumnFilteringEnabled = useMemo(() => gridProps.columns.some((x) => x.filter), [gridProps.columns]);

  const isHeaderMenuActive = useMemo(
    () => gridProps.headerActionsMenu?.enabled === undefined || gridProps.headerActionsMenu?.enabled === true,
    [gridProps.headerActionsMenu]
  );

  const selectedRowProps = useSelectedRows(gridProps);
  const activeRowProps = useActiveRow();

  const onRowClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>, cellData: DataType) => {
      e.stopPropagation();
      if (gridProps.rowSelection?.enabled && gridProps.rowSelection?.type === "onRowClick")
        selectedRowProps.updateSelectedRows(cellData[gridProps.uniqueRowKey]);
      else if (gridProps.onRowClick) {
        activeRowProps.updateActiveRow(cellData[gridProps.uniqueRowKey]);
        gridProps.onRowClick?.(e, cellData);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gridProps.rowSelection]
  );

  const isRightClickIsActive = useMemo(
    () => gridProps.rowActionsMenu?.enabled && gridProps.rowActionsMenu?.displayOnRightClick !== false,
    [gridProps.rowActionsMenu?.enabled, gridProps.rowActionsMenu?.displayOnRightClick]
  );

  return {
    isColumnIsDraggable,
    isColumnIsResizable,
    isFilterFnIsActive,
    isRightClickIsActive,
    isHeaderMenuActive,
    isVirtualizationIsEnabled,
    isColumnFilteringEnabled,
    onRowClick,
    ...useColumnDimensions(gridProps, dimensions),
    ...useColumnOrder(gridProps),
    ...useExpandedRows(gridProps),
    ...usePinnedColumns(gridProps),
    ...useVisibleColumns(gridProps),
    ...useGridFeatures(gridProps),
    ...useActiveHeaders(),
    ...activeRowProps,
    ...selectedRowProps,
  };
}
