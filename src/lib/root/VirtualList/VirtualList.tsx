import React from "react";
import { VirtualListProps } from "../../types/Elements";
import "./VirtualList.css";

export default function VirtualList<DataType>({
  elements,
  scrollPosition,
  rowHeight,
  containerHeight,
  disabled,
  expandRowKeys,
  expandPanelHeight,
  uniqueRowKey,
  renderElement,
  preRenderedRowCount,
}: VirtualListProps<DataType>) {
  const bufferedItems = (preRenderedRowCount ?? 2) + expandRowKeys.size;

  function calcExpansionHeight(expKeys: Set<number>, elements: Array<DataType>) {
    if (expKeys.size === 0) return;
    let elementsToIncreaseHeight = 0;
    const obj: Record<number, number> = {};
    elements.forEach((c) => {
      const uniqueId = c[uniqueRowKey];
      obj[uniqueId as number] = elementsToIncreaseHeight * expandPanelHeight;
      if (expKeys.has(uniqueId as number)) {
        elementsToIncreaseHeight++;
      }
    });
    return obj;
  }

  const visibleChildren = React.useMemo(() => {
    const startIndex = Math.max(Math.floor(scrollPosition / rowHeight) - bufferedItems, 0);
    const endIndex = Math.min(
      Math.ceil((scrollPosition + containerHeight) / rowHeight - 1) + bufferedItems,
      elements.length - 1
    );

    const expandWidthPerRow = calcExpansionHeight(expandRowKeys, elements);

    if (disabled)
      return elements.map((data, index) => {
        const uniqueId = data[uniqueRowKey];
        const styleToApply: React.CSSProperties = {
          position: "absolute",
          top: index * rowHeight + index + (expandWidthPerRow?.[uniqueId as number] ?? 0),
          height: rowHeight,
          left: 0,
          right: 0,
          lineHeight: `${rowHeight}px`,
        };
        return renderElement(data, styleToApply);
      });

    return elements.slice(startIndex, endIndex + 1).map((data, index) => {
      const uniqueId = data[uniqueRowKey];
      const styleToApply: React.CSSProperties = {
        position: "absolute",
        top: (startIndex + index) * rowHeight + index + (expandWidthPerRow?.[uniqueId as number] ?? 0),
        height: rowHeight,
        left: 0,
        right: 0,
        lineHeight: `${rowHeight}px`,
      };
      return renderElement(data, styleToApply);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements, containerHeight, disabled, expandRowKeys, rowHeight, scrollPosition]);

  return visibleChildren as unknown as JSX.Element;
}
