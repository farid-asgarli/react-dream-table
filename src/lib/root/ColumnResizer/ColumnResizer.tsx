import React, { useCallback, useEffect, useState } from "react";
import { cs } from "../../utils/ConcatStyles";
import { useDraggable } from "../../hooks/use-draggable/use-draggable";
import { useDataGridStaticContext } from "../../context/DataGridStaticContext";
import "./ColumnResizer.css";

function ColumnResizer({
  className,
  updateColumnWidth,
  updateColumnResizingStatus,
  containerHeight,
  columnWidth,
  columnKey,
  ...props
}: React.HtmlHTMLAttributes<HTMLDivElement> & {
  updateColumnWidth: (key: string, width: number) => void;
  updateColumnResizingStatus: (val: boolean) => void;
  columnKey: string;
  containerHeight?: number;
  columnWidth: number;
}) {
  const { dimensions } = useDataGridStaticContext();

  const [ref, pressed] = useDraggable({
    onDragEnd: onDragEnd,
    onDrag: onDrag,
  });

  const [outOfBounds, setOutOfBounds] = useState<boolean>(false);

  function updateOutOfBounds(val: boolean) {
    if (outOfBounds !== val) setOutOfBounds(val);
  }

  const checkResize = useCallback(
    (xAxis: number) => {
      const width = xAxis + columnWidth;
      if (width < dimensions.minColumnResizeWidth || width > dimensions.maxColumnResizeWidth) updateOutOfBounds(true);
      else if (width >= dimensions.minColumnResizeWidth && width <= dimensions.maxColumnResizeWidth) updateOutOfBounds(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [outOfBounds, columnWidth]
  );

  function onDragEnd(position: { xAxis: number }) {
    updateColumnWidth(columnKey, position.xAxis);
    setOutOfBounds(false);
  }

  function onDrag(position: { xAxis: number }) {
    checkResize(position.xAxis);
    return position;
  }

  useEffect(() => {
    updateColumnResizingStatus(pressed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pressed]);

  return (
    <div className={cs("column-resizer", className)} {...props}>
      <div
        ref={ref}
        className={cs("column-resize-handle", pressed && "active", outOfBounds && "out-of-bounds")}
        style={{
          height: pressed ? `calc(100% + ${containerHeight ?? 0}px)` : undefined,
        }}
      />
    </div>
  );
}
export default ColumnResizer;
