import { useMemo, useRef, useState } from "react";
import { DataGridProps } from "../../types/DataGrid";
import { GridDataType } from "../../types/Utils";

export default function useExpandedRows<DataType extends GridDataType>(gridProps: DataGridProps<DataType>) {
  const [expandedRowKeys, setExpandedRowKeys] = useState<Set<number>>(new Set());
  const [expandRowHeightCache, setExpandRowHeightCache] = useState<Record<number, number | undefined>>({});

  const __lastExpRowCache = useRef<{ index: number; isOpen: boolean } | null>(null);

  function updateRowExpansion(index: number) {
    setExpandedRowKeys((prev) => {
      const stateCopy = new Set(prev);
      if (prev.has(index)) {
        stateCopy.delete(index);
        gridProps.expandableRows?.onRowShrink?.(index);
        __lastExpRowCache.current = { index, isOpen: false };
      } else {
        stateCopy.add(index);
        gridProps.expandableRows?.onRowExpand?.(index);
        __lastExpRowCache.current = { index, isOpen: true };
      }
      return stateCopy;
    });
  }

  function closeExpandedRows() {
    if (expandedRowKeys.size > 0) setExpandedRowKeys(new Set());
  }

  function isRowExpanded(uniqueRowKey: number) {
    return expandedRowKeys.has(uniqueRowKey);
  }

  function updateExpandRowHeightCache(index: number, height: number, forceUpdate = false) {
    if (forceUpdate || expandRowHeightCache[index] === undefined) setExpandRowHeightCache((prev) => ({ ...prev, [index]: height }));
  }

  function clearExpandRowHeightCache() {
    setExpandRowHeightCache({});
  }

  function getExpandRowHeightFromCache(index: number) {
    return expandRowHeightCache[index];
  }

  const isDynamicRowExpandHeightEnabled = useMemo(
    () => gridProps.virtualization?.dynamicExpandRowHeight === true,
    [gridProps.virtualization?.dynamicExpandRowHeight]
  );

  return {
    expandedRowKeys,
    expandRowHeightCache,
    updateRowExpansion,
    closeExpandedRows,
    isRowExpanded,
    updateExpandRowHeightCache,
    clearExpandRowHeightCache,
    getExpandRowHeightFromCache,
    isDynamicRowExpandHeightEnabled,
    __lastExpRowCache,
  };
}
