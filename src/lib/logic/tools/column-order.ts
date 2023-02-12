import { useState } from "react";
import { KeyLiteralType, DataGridProps } from "../../types/DataGrid";
import { GridDataType } from "../../types/Utils";

export default function useColumnOrder<DataType extends GridDataType>(gridProps: DataGridProps<DataType>) {
  const [columnOrder, setColumnOrder] = useState<Array<KeyLiteralType<DataType>>>(
    gridProps.draggableColumns?.enabled && gridProps.draggableColumns?.defaultColumnOrder
      ? gridProps.draggableColumns.defaultColumnOrder
      : gridProps.columns.map(({ key }) => key)
  );

  function updateColumnOrder(collection: Array<KeyLiteralType<DataType>>) {
    setColumnOrder(collection);
  }

  return {
    columnOrder,
    updateColumnOrder,
  };
}
