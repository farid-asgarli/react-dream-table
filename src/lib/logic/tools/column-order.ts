import { useState } from "react";
import { KeyLiteralType, TableProps } from "../../types/Table";

export default function useColumnOrder<DataType>(tp: TableProps<DataType>) {
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
