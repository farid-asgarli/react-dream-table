import { useCallback, useEffect, useState } from "react";
import { DefaultTableDimensions } from "../static/dimensions";

interface ColumnResizerHookProps {
  headerDataRefs: Map<string, HTMLDivElement | null>;
  handleChangeColumnSize(key: string, newWidth: number): void;
  minColumnResizeWidth?: number | undefined;
  maxColumnResizeWidth?: number | undefined;
}

export function useColumnResizer(
  {
    headerDataRefs,
    handleChangeColumnSize,
    minColumnResizeWidth = DefaultTableDimensions.minColumnResizeWidth,
    maxColumnResizeWidth = Infinity,
  }: ColumnResizerHookProps,
  enabled: boolean = false
) {
  const [activeIndex, setActiveIndex] = useState<string>();

  function mouseDown(index: string) {
    setActiveIndex(index);
  }

  const mouseMove = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      if (activeIndex && enabled) {
        const column = headerDataRefs.get(activeIndex);
        if (column) {
          /** Total x axis offset of the column relative to client window, including scroll length. */
          const columnLeftOffset = column.getBoundingClientRect().left;
          const width =
            /** X offset of resize operation (e.clientX). */
            e.clientX - columnLeftOffset;
          if (width >= minColumnResizeWidth && width <= maxColumnResizeWidth) {
            handleChangeColumnSize(activeIndex, width);
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeIndex]
  );

  const removeListeners = useCallback(() => {
    if (enabled) {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", removeListeners);
    }
  }, [enabled, mouseMove]);

  const mouseUp = useCallback(() => {
    setActiveIndex(undefined);
    removeListeners();
  }, [setActiveIndex, removeListeners]);

  useEffect(() => {
    if (activeIndex !== null && enabled) {
      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);
    }

    return () => {
      removeListeners();
    };
  }, [activeIndex, enabled, mouseMove, mouseUp, removeListeners]);

  return {
    mouseDown,
    activeIndex,
  };
}
