import { useState } from "react";
import { DataGridProps } from "../../types/DataGrid";
import { DataGridRowKeyDefinition } from "../../types/Utils";

export default function useExpandedRows<DataType>(tp: DataGridProps<DataType>) {
  const [expandedRowKeys, setExpandedRowKeys] = useState<Set<DataGridRowKeyDefinition>>(new Set());

  function updateRowExpansion(key: DataGridRowKeyDefinition) {
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

  function closeExpandedRows() {
    setExpandedRowKeys(new Set());
  }

  function isRowExpanded(uniqueRowKey: string) {
    return expandedRowKeys.has(uniqueRowKey);
  }

  return {
    expandedRowKeys,
    updateRowExpansion,
    closeExpandedRows,
    isRowExpanded,
  };
}
