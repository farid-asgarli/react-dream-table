/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";

type RefKeyObject<TRef> = {
  readonly key: string;
  readonly ref: React.RefObject<TRef>;
};

/**
 * A hook that fires when the area outside the current element is clicked.
 * @param refObject A collection of ref objects or a single ref.
 * @param callback Function to execute on click.
 */
export function useDetectOutsideClick<TRef>(
  refObject: RefKeyObject<TRef>[],
  callback?: (event: MouseEvent, key?: string) => void
) {
  useEffect(() => {
    function fireEvent(ref: React.RefObject<TRef>, event: MouseEvent, key?: string) {
      if (ref.current && !(ref.current as any).contains(event.target)) {
        callback?.(event, key);
      }
    }

    function handleClickOutside(event: MouseEvent) {
      !Array.isArray(refObject)
        ? fireEvent(refObject, event)
        : refObject.forEach((refObject) => fireEvent(refObject.ref, event, refObject.key));
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refObject]);
}
