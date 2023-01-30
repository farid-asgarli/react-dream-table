/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";

/**
 * A hook that fires when the area outside the current element is clicked.
 * @param refObject A collection of ref objects or a single ref.
 * @param callback Function to execute on click.
 */
export function useDetectOutsideClick<TRef>(
  elementRef: React.RefObject<TRef>,
  callback?: (event: MouseEvent, key?: string) => void
) {
  useEffect(() => {
    function fireEvent(ref: React.RefObject<TRef>, event: MouseEvent, key?: string) {
      if (ref.current && !(ref.current as any).contains(event.target)) {
        callback?.(event, key);
      }
    }

    function handleClickOutside(event: MouseEvent) {
      fireEvent(elementRef, event);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [elementRef]);
}
