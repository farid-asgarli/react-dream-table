import { useState } from "react";
import { KeyLiteralType, TableProps } from "../../types/Table";

export default function useVisibleColumns<DataType>(tp: TableProps<DataType>) {
  const [visibleColumns, setVisibleColumns] = useState<Set<KeyLiteralType<DataType>>>(
    tp.columnVisibilityOptions?.active && tp.columnVisibilityOptions?.defaultVisibleHeaders
      ? new Set(tp.columnVisibilityOptions.defaultVisibleHeaders)
      : new Set(tp.columns.map((x) => x.key))
  );

  function updateColumnVisibility(key: string) {
    const visibleColumnsCopy = new Set(visibleColumns);

    if (visibleColumnsCopy.size > 1 && visibleColumnsCopy.has(key)) {
      visibleColumnsCopy.delete(key);
    } else visibleColumnsCopy.add(key);

    tp.columnVisibilityOptions?.onVisibilityChange?.(Array.from(visibleColumnsCopy));

    setVisibleColumns(visibleColumnsCopy);
    return visibleColumnsCopy;
  }

  return {
    visibleColumns,
    updateColumnVisibility,
  };
}
