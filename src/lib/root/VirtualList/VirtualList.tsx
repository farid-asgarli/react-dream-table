import React, { useMemo } from "react";
import { ConstProps } from "../../static/constantProps";
import { VirtualListProps } from "../../types/Elements";
import "./VirtualList.css";

export default function VirtualList<DataType>({
  elements,
  topScrollPosition,
  rowHeight,
  containerHeight,
  disabled,
  expandRowKeys,
  expandPanelHeight,
  uniqueRowKey,
  renderElement,
  preRenderedRowCount = ConstProps.defaultPreRenderedRows,
}: VirtualListProps<DataType>) {
  const bufferedItems = preRenderedRowCount + expandRowKeys.size;
  const expansionHeightPerRow = useMemo(() => {
    if (expandRowKeys.size === 0) return;
    let elementsToIncreaseHeight = 0;
    const expDictionary: Record<number, number> = {};
    elements.forEach((c) => {
      const uniqueId = c[uniqueRowKey];
      expDictionary[uniqueId as number] = elementsToIncreaseHeight * expandPanelHeight;
      if (expandRowKeys.has(uniqueId as number)) {
        elementsToIncreaseHeight++;
      }
    });
    return expDictionary;
  }, [elements, expandPanelHeight, expandRowKeys, uniqueRowKey]);

  const visibleVirtualChildren = React.useMemo(() => {
    const startIndex = Math.max(Math.floor(topScrollPosition / rowHeight) - bufferedItems, 0);
    const endIndex = Math.min(Math.ceil((topScrollPosition + containerHeight) / rowHeight - 1) + bufferedItems, elements.length - 1);

    return elements.slice(startIndex, endIndex + 1).map((data, index) => {
      const uniqueId = data[uniqueRowKey];
      const styleToApply: React.CSSProperties = {
        position: "absolute",
        top: (startIndex + index) * rowHeight + (expansionHeightPerRow?.[uniqueId as number] ?? 0),
        height: rowHeight,
      };
      return renderElement(data, styleToApply);
    });
    // elements, containerHeight, disabled, expandRowKeys, rowHeight, topScrollPosition
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements, containerHeight, disabled, rowHeight, topScrollPosition, expansionHeightPerRow, renderElement]);

  const visibleNonVirtualChildren = React.useMemo(
    () => elements.map((data) => renderElement(data, {})),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [elements, renderElement]
  );

  if (disabled) return visibleNonVirtualChildren as unknown as JSX.Element;
  return visibleVirtualChildren as unknown as JSX.Element;
}
