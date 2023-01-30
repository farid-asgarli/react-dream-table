import { useState } from "react";
import { TableProps } from "../../types/Table";
import { TableRowKeyType } from "../../types/Utils";

export default function useSelectedRows<DataType>(tp: TableProps<DataType>) {
  /** List of checked items in the table. */
  const [selectedRows, setSelectedRows] = useState<Set<TableRowKeyType>>(new Set());

  function updateSelectedRows(value: TableRowKeyType) {
    setSelectedRows((rows) => {
      if (rows.has(value)) {
        const updatedRows = new Set(rows);
        updatedRows.delete(value);
        return updatedRows;
      }
      return new Set(rows).add(value);
    });
  }

  function updateSelectedRowsMultiple(collection: Set<TableRowKeyType>) {
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
