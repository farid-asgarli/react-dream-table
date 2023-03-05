import { useState } from "react";

export default function useActiveRow() {
  const [activeRow, setActiveRow] = useState<string>();

  function updateActiveRow(uniqueRowKey: string) {
    if (uniqueRowKey === undefined) {
      console.warn("DataGrid", "Attempted to set 'undefined' as active row");
      return;
    }
    if (uniqueRowKey === null) {
      console.warn("DataGrid", "Attempted to set 'null' as active row");
      return;
    }
    if (activeRow === uniqueRowKey) return;
    setActiveRow(uniqueRowKey);
  }

  function clearActiveRow() {
    activeRow !== undefined && setActiveRow(undefined);
  }

  function isRowActive(uniqueRowKey: string) {
    if (uniqueRowKey === undefined) return false;
    return activeRow === uniqueRowKey;
  }

  return {
    updateActiveRow,
    clearActiveRow,
    isRowActive,
    activeRow,
  };
}
