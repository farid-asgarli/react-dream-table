import React, { useCallback } from "react";
import { ConstProps } from "../../static/constantProps";
import { VirtualListProps } from "../../types/Elements";
import { IndexedData } from "../../types/Utils";

export default function VirtualList<DataType extends IndexedData>({
  rows,
  rowHeight,
  expandRowKeys,
  renderElement,
  containerHeight,
  expandPanelHeight,
  topScrollPosition,
  isDynamicExpandActive,
  getRowExpansionHeight,
  preRenderedRowCount = ConstProps.defaultPreRenderedRows,
}: VirtualListProps<DataType>) {
  const expandPanelHeightToDeduct = React.useMemo(() => {
    if (!expandRowKeys.size) return 0;
    if (isDynamicExpandActive) {
      let totalHeight = 0;
      expandRowKeys.forEach((exp) => {
        if (exp < Math.floor(topScrollPosition / rowHeight)) totalHeight += getRowExpansionHeight(exp) ?? 0;
      });
      return totalHeight;
    } else return Array.from(expandRowKeys).filter((x) => x < Math.floor(topScrollPosition / rowHeight)).length * expandPanelHeight;
  }, [expandPanelHeight, expandRowKeys, getRowExpansionHeight, isDynamicExpandActive, rowHeight, topScrollPosition]);

  const extractVirtualizedData = useCallback(
    (start: number, end: number) => {
      const virtualizedRows: JSX.Element[] = [];
      for (let index = start; index <= end; index++) {
        if (rows[index] !== undefined)
          virtualizedRows.push(
            renderElement(rows[index], {
              position: "absolute",
              top: index * rowHeight + (getRowExpansionHeight(rows[index].__virtual_row_index) ?? 0),
            })
          );
      }
      return virtualizedRows;
    },
    [getRowExpansionHeight, renderElement, rowHeight, rows]
  );

  return React.useMemo(() => {
    const startIndex = Math.max(Math.floor((topScrollPosition - expandPanelHeightToDeduct) / rowHeight) - preRenderedRowCount, 0);
    const endIndex = Math.min(Math.ceil((topScrollPosition + containerHeight) / rowHeight - 1) + preRenderedRowCount, rows.length - 1);

    return extractVirtualizedData(startIndex, endIndex + 3);
  }, [
    topScrollPosition,
    expandPanelHeightToDeduct,
    rowHeight,
    preRenderedRowCount,
    containerHeight,
    rows.length,
    extractVirtualizedData,
  ]) as unknown as JSX.Element;
}
