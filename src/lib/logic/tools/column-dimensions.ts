import { useState } from "react";
import { DataGridDimensionsDefinition, DataGridProps, KeyLiteralType } from "../../types/DataGrid";
import { GridDataType } from "../../types/Utils";
import { arrayToObject } from "../../utils/ColumnArrayToRecord";

export default function useColumnDimensions<DataType extends GridDataType>(
  gridProps: DataGridProps<DataType>,
  dimensions: DataGridDimensionsDefinition
) {
  /** Set of column dimensions (e.g. width). */
  const [columnDimensions, setColumnDimensions] = useState<Record<string, number>>(
    arrayToObject(gridProps.columns, (col) => col.width ?? dimensions.defaultColumnWidth) as Record<string, number>
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
    gridProps.resizableColumns?.onColumnResize?.(newColDimensions as Record<KeyLiteralType<DataType>, number>);
  }

  function updateColumnWidthMultiple(collection: Record<string, number>) {
    setColumnDimensions(collection);
  }

  function updateColumnResizingStatus(val: boolean) {
    if (isColumnResizing !== val) setIsColumnResizing(val);
  }

  function getColumnWidth(colKey: string) {
    switch (colKey) {
      case "select":
        return dimensions.selectionMenuColumnWidth;
      case "expand":
        return dimensions.expandedMenuColumnWidth;
      case "actions":
        return dimensions.actionsMenuColumnWidth;
      default:
        return columnDimensions[colKey];
    }
  }

  return {
    isColumnResizing,
    columnDimensions,
    getColumnWidth,
    updateColumnWidth,
    updateColumnWidthMultiple,
    updateColumnResizingStatus,
  };
}
