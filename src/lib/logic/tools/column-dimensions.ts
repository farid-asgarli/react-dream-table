import { useState } from "react";
import { DataGridDimensionsDefinition, DataGridProps } from "../../types/DataGrid";
import { arrayToObject } from "../../utils/ColumnArrayToRecord";

export default function useColumnDimensions<DataType>(tp: DataGridProps<DataType>, dimensions: DataGridDimensionsDefinition) {
  /** Set of column dimensions (e.g. width). */
  const [columnDimensions, setColumnDimensions] = useState<Record<string, number>>(
    arrayToObject(tp.columns, (col) => col.width) as Record<string, number>
  );
  const [isColumnResizing, setIsColumnResizing] = useState<boolean>(false);

  function updateColumnWidth(key: string, newWidth: number) {
    const width = columnDimensions[key] + newWidth;
    let newColDimensions = columnDimensions;
    if (width >= dimensions.minColumnResizeWidth && dimensions.maxColumnResizeWidth >= width) {
      newColDimensions = { ...columnDimensions, [key]: Math.round(width) };
    } else if (width > dimensions.maxColumnResizeWidth) newColDimensions = { ...columnDimensions, [key]: dimensions.maxColumnResizeWidth };
    else if (width < dimensions.minColumnResizeWidth) newColDimensions = { ...columnDimensions, [key]: dimensions.minColumnResizeWidth };

    setColumnDimensions(newColDimensions);
    tp.resizableColumns?.onColumnResize?.(newColDimensions as any);
  }

  function updateColumnWidthMultiple(collection: Record<string, number>) {
    setColumnDimensions(collection);
  }

  function updateColumnResizingStatus(val: boolean) {
    if (isColumnResizing !== val) setIsColumnResizing(val);
  }

  return {
    isColumnResizing,
    columnDimensions,
    updateColumnWidth,
    updateColumnWidthMultiple,
    updateColumnResizingStatus,
  };
}
