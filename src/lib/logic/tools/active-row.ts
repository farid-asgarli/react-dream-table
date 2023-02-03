import { useState } from "react";

export default function useActiveRow() {
  const [activeRow, setActiveRow] = useState<string>();

  function updateActiveRow(uniqueRowKey: string) {
    if (activeRow === uniqueRowKey) return;
    setActiveRow(uniqueRowKey);
  }

  function clearActiveRow() {
    setActiveRow(undefined);
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
