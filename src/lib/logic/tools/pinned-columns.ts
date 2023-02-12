import { useState } from "react";
import { KeyLiteralType, DataGridProps } from "../../types/DataGrid";
import { GridDataType } from "../../types/Utils";

export default function usePinnedColumns<DataType extends GridDataType>(gridProps: DataGridProps<DataType>) {
  const [pinnedColumns, setPinnedColumns] = useState<{
    left: Array<KeyLiteralType<DataType>>;
    right: Array<KeyLiteralType<DataType>>;
  }>({ left: gridProps.pinnedColumns?.left ?? [], right: gridProps.pinnedColumns?.right ?? [] });

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
    gridProps.pinnedColumns?.onColumnPin?.(newState);
    setPinnedColumns(newState);
  }

  return {
    pinnedColumns,
    updatePinnedColumns,
  };
}
