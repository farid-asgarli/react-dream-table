import { useState } from "react";

export default function useActiveRow() {
  const [activeRow, setActiveRow] = useState<string>();

  function updateActiveRow(uniqueRowKey: string) {
    setActiveRow(uniqueRowKey);
  }

  function clearActiveRow() {
    setActiveRow(undefined);
  }

  function isRowActive(uniqueRowKey: string) {
    return activeRow === uniqueRowKey;
  }

  return {
    updateActiveRow,
    clearActiveRow,
    isRowActive,
    activeRow,
  };
}
