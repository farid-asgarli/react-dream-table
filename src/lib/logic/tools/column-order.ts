import { useState } from "react";
import { KeyLiteralType, DataGridProps } from "../../types/DataGrid";

export default function useColumnOrder<DataType>(tp: DataGridProps<DataType>) {
  const [columnOrder, setColumnOrder] = useState<Array<KeyLiteralType<DataType>>>(
    tp.draggableColumns?.active && tp.draggableColumns?.defaultColumnOrder
      ? tp.draggableColumns.defaultColumnOrder
      : tp.columns.map(({ key }) => key)
  );

  function updateColumnOrder(collection: Array<KeyLiteralType<DataType>>) {
    setColumnOrder(collection);
  }

  return {
    columnOrder,
    updateColumnOrder,
  };
}
