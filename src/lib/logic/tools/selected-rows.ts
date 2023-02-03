import { useState } from "react";
import { DataGridProps } from "../../types/DataGrid";
import { DataGridRowKeyDefinition } from "../../types/Utils";

export default function useSelectedRows<DataType>(tp: DataGridProps<DataType>) {
  /** List of checked items in the data-grid. */
  const [selectedRows, setSelectedRows] = useState<Set<DataGridRowKeyDefinition>>(new Set());

  function updateSelectedRows(value: DataGridRowKeyDefinition) {
    setSelectedRows((rows) => {
      if (rows.has(value)) {
        const updatedRows = new Set(rows);
        updatedRows.delete(value);
        return updatedRows;
      }
      return new Set(rows).add(value);
    });
  }

  function updateSelectedRowsMultiple(collection: Set<DataGridRowKeyDefinition>) {
    setSelectedRows(collection);
  }

  function isRowSelected(uniqueRowKey: string) {
    return selectedRows.has(uniqueRowKey);
  }

  return {
    selectedRows,
    updateSelectedRows,
    updateSelectedRowsMultiple,
    isRowSelected,
  };
}
