import { useState } from "react";
import { KeyLiteralType, DataGridProps } from "../../types/DataGrid";

export default function usePinnedColumns<DataType>(tp: DataGridProps<DataType>) {
  const [pinnedColumns, setPinnedColumns] = useState<{
    left: Array<KeyLiteralType<DataType>>;
    right: Array<KeyLiteralType<DataType>>;
  }>({ left: tp.pinnedColumns?.left ?? [], right: tp.pinnedColumns?.right ?? [] });

  function updatePinnedColumns(colKey: string, position: keyof typeof pinnedColumns) {
    let newState = { ...pinnedColumns };

    const currentPosition = pinnedColumns["left"].includes(colKey) ? "left" : pinnedColumns["right"].includes(colKey) ? "right" : undefined;

    if (currentPosition === position) {
      newState[position] = [...newState[position].filter((x) => x !== colKey)];
    } else if (currentPosition === undefined) {
      newState[position] = [...newState[position], colKey];
    } else {
      newState[currentPosition] = [...newState[currentPosition].filter((x) => x !== colKey)];
      newState[position] = [...newState[position], colKey];
    }
    tp.pinnedColumns?.onColumnPin?.(newState);
    setPinnedColumns(newState);
  }

  return {
    pinnedColumns,
    updatePinnedColumns,
  };
}
