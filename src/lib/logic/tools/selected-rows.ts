import { useState } from "react";
import { DataGridProps } from "../../types/DataGrid";
import { DataGridRowKeyDefinition, GridDataType } from "../../types/Utils";

export default function useSelectedRows<DataType extends GridDataType>(gridProps: DataGridProps<DataType>) {
  /** List of checked items in the data-grid. */
  const [selectedRows, setSelectedRows] = useState<Set<DataGridRowKeyDefinition>>(
    gridProps.rowSelection?.defaultValues ? new Set(gridProps.rowSelection?.defaultValues) : new Set()
  );

  function updateSelectedRows(value: DataGridRowKeyDefinition) {
    if (value === undefined) {
      console.warn("DataGrid", "Attempted to set 'undefined' as selected row");
      return;
    }
    if (value === null) {
      console.warn("DataGrid", "Attempted to set 'null' as selected row");
      return;
    }
    setSelectedRows((prev) => {
      const copiedRows = new Set(prev);

      if (copiedRows.has(value)) copiedRows.delete(value);
      else copiedRows.add(value);

      gridProps.rowSelection?.onChange?.(Array.from(copiedRows));
      return copiedRows;
    });
  }

  function updateSelectedRowsMultiple(collection: Array<DataGridRowKeyDefinition>) {
    const uniqueIds = collection.filter((x) => x !== undefined);
    setSelectedRows(new Set(uniqueIds));
    gridProps.rowSelection?.onChange?.(uniqueIds);
  }

  function isRowSelected(uniqueRowKey: string) {
    return selectedRows.has(uniqueRowKey);
  }

  function clearSelectedRows() {
    updateSelectedRowsMultiple([]);
  }

  return {
    selectedRows,
    updateSelectedRows,
    updateSelectedRowsMultiple,
    isRowSelected,
    clearSelectedRows,
  };
}
