/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";

interface ColumnResizerHookProps {
  headerDataRefs: Map<string, HTMLDivElement | null>;
  onColumnResize?(key: string, newWidth: number): void;
  minColumnResizeWidth?: number | undefined;
  maxColumnResizeWidth?: number | undefined;
}

export function useColumnResizer(
  containerRef: React.RefObject<HTMLDivElement>,
  {
    headerDataRefs,
    onColumnResize,
    minColumnResizeWidth = 50,
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
            onColumnResize?.(activeIndex, width);
          }
        }
      }
    },
    [activeIndex]
  );

  const removeListeners = useCallback(() => {
    if (enabled) {
      containerRef.current?.removeEventListener("mousemove", mouseMove);
      containerRef.current?.removeEventListener("mouseup", removeListeners);
    }
  }, [enabled, mouseMove]);

  const mouseUp = useCallback(() => {
    setActiveIndex(undefined);
    removeListeners();
  }, [setActiveIndex, removeListeners]);

  useEffect(() => {
    if (activeIndex !== null && enabled) {
      containerRef.current?.addEventListener("mousemove", mouseMove);
      containerRef.current?.addEventListener("mouseup", mouseUp);
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
