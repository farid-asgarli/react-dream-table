import { useState } from "react";
import { ColumnType } from "../../types/Table";
import { arrayToObject } from "../../utils/ColumnArrayToRecord";

export default function useColumnDimensions<DataType>(columns: ColumnType<DataType>[]) {
  /** Set of column dimensions (e.g. width). */
  const [columnDimensions, setColumnDimensions] = useState<Record<string, number>>(
    arrayToObject(columns, (col) => col.width) as Record<string, number>
  );

  function updateColumnWidth(key: string, newWidth: number) {
    setColumnDimensions((prev) => ({ ...prev, [key]: newWidth }));
  }

  function updateColumnWidthMultiple(collection: Record<string, number>) {
    setColumnDimensions(collection);
  }

  return {
    columnDimensions,
    updateColumnWidth,
    updateColumnWidthMultiple,
  };
}
