import { useState } from "react";
import { TableProps } from "../../types/Table";
import { TableRowKeyType } from "../../types/Utils";

export default function useExpandedRows<DataType>(tp: TableProps<DataType>) {
  const [expandedRowKeys, setExpandedRowKeys] = useState<Set<TableRowKeyType>>(new Set());

  function updateRowExpansion(key: TableRowKeyType) {
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
