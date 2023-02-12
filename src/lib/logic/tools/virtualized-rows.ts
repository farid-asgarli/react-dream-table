import { useCallback, useMemo } from "react";
import { IndexedData } from "../../types/Utils";
import useExpandedRows from "./expanded-rows";

export function useVirtualizedRows<DataType extends Record<string, any>>(
  data: IndexedData<DataType>[] | undefined,
  expandedRowTools: Pick<
    ReturnType<typeof useExpandedRows<DataType>>,
    "getExpandRowHeightFromCache" | "expandedRowKeys" | "isDynamicRowExpandHeightEnabled" | "expandRowHeightCache" | "__lastExpRowCache"
  >,
  defaultExpandPanelHeight: number,
  isVirtualizationEnabled: boolean
) {
  const dynamicExpansionHeightPerRow = useMemo(() => {
    if (!isVirtualizationEnabled || !data) return;
    const {
      expandRowHeightCache,
      expandedRowKeys,
      isDynamicRowExpandHeightEnabled,
      //  __lastExpRowCache
    } = expandedRowTools;
    if (!isDynamicRowExpandHeightEnabled) return;
    if (!expandedRowKeys.size) return;
    // TODO Prevent further rendering
    // if (!__lastExpRowCache.current || expandRowHeightCache[__lastExpRowCache.current.index] === undefined) return;
    const expansionDictionary: Record<number, number> = {};
    let lastExpandedRowIndex: number | undefined = undefined;
    let totalExpandHeight = 0;

    for (let index = 0; index < data.length; index++) {
      const __virtual_row_index = data[index].__virtual_row_index;

      const expandHeight = lastExpandedRowIndex !== undefined ? expandRowHeightCache[lastExpandedRowIndex] ?? defaultExpandPanelHeight : 0;

      expansionDictionary[__virtual_row_index] = totalExpandHeight + expandHeight;
      if (expandedRowKeys.has(__virtual_row_index) && expandRowHeightCache[__virtual_row_index]) {
        lastExpandedRowIndex = __virtual_row_index;
        totalExpandHeight += expandHeight;
      }
    }

    return {
      expansionDictionary,
      totalExpandHeight,
    };
  }, [isVirtualizationEnabled, data, expandedRowTools, defaultExpandPanelHeight]);

  const staticExpansionHeightPerRow = useMemo(() => {
    if (!isVirtualizationEnabled || !data || !expandedRowTools.expandedRowKeys.size) return;
    let totalExpandHeight = 0;
    const expansionDictionary: Record<number, number> = {};
    for (let index = 0; index < data.length; index++) {
      const __virtual_row_index = data[index].__virtual_row_index;
      expansionDictionary[__virtual_row_index] = totalExpandHeight;
      if (expandedRowTools.expandedRowKeys.has(__virtual_row_index)) totalExpandHeight += defaultExpandPanelHeight;
    }

    return {
      expansionDictionary,
      totalExpandHeight,
    };
  }, [data, defaultExpandPanelHeight, expandedRowTools.expandedRowKeys, isVirtualizationEnabled]);

  const getRowExpansionHeight = useCallback(
    (index: number) => {
      return expandedRowTools.isDynamicRowExpandHeightEnabled
        ? dynamicExpansionHeightPerRow?.expansionDictionary[index]
        : staticExpansionHeightPerRow?.expansionDictionary[index];
    },
    [
      dynamicExpansionHeightPerRow?.expansionDictionary,
      expandedRowTools.isDynamicRowExpandHeightEnabled,
      staticExpansionHeightPerRow?.expansionDictionary,
    ]
  );

  const getTotalExpansionHeight = useMemo(() => {
    return expandedRowTools.isDynamicRowExpandHeightEnabled
      ? dynamicExpansionHeightPerRow?.totalExpandHeight
      : staticExpansionHeightPerRow?.totalExpandHeight;
  }, [
    dynamicExpansionHeightPerRow?.totalExpandHeight,
    expandedRowTools.isDynamicRowExpandHeightEnabled,
    staticExpansionHeightPerRow?.totalExpandHeight,
  ]);

  return {
    getRowExpansionHeight,
    getTotalExpansionHeight,
  };
}
