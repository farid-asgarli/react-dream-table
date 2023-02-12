import { useState } from "react";
import { KeyLiteralType, DataGridProps } from "../../types/DataGrid";
import { GridDataType } from "../../types/Utils";

export default function useVisibleColumns<DataType extends GridDataType>(gridProps: DataGridProps<DataType>) {
  const [visibleColumns, setVisibleColumns] = useState<Set<KeyLiteralType<DataType>>>(
    gridProps.columnVisibilityOptions?.enabled && gridProps.columnVisibilityOptions?.defaultVisibleHeaders
      ? new Set(gridProps.columnVisibilityOptions.defaultVisibleHeaders)
      : new Set(gridProps.columns.map((x) => x.key))
  );

  function updateColumnVisibility(key: string) {
    const visibleColumnsCopy = new Set(visibleColumns);

    if (visibleColumnsCopy.size > 1 && visibleColumnsCopy.has(key)) {
      visibleColumnsCopy.delete(key);
    } else visibleColumnsCopy.add(key);

    gridProps.columnVisibilityOptions?.onVisibilityChange?.(Array.from(visibleColumnsCopy));

    setVisibleColumns(visibleColumnsCopy);
    return visibleColumnsCopy;
  }

  return {
    visibleColumns,
    updateColumnVisibility,
  };
}
