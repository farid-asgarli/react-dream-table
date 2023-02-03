/* eslint-disable react-hooks/exhaustive-deps */

/**
 * Resizing hook to adjust width.
 * Dependent on element refs and is index based.
 * Not a performant solution, but appeals visually.
 * Causes stutter and frame drops when the row count exceeds 30.
 */

import { useCallback, useEffect, useState } from "react";

interface ColumnResizeHookProps {
  headerDataRefs: Map<string, HTMLDivElement | null>;
  onColumnResize?(key: string, newWidth: number): void;
  minColumnResizeWidth?: number | undefined;
  maxColumnResizeWidth?: number | undefined;
}

export function useColumnResize(
  containerRef: React.RefObject<HTMLDivElement>,
  { headerDataRefs, onColumnResize, minColumnResizeWidth = 50, maxColumnResizeWidth = Infinity }: ColumnResizeHookProps,
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
