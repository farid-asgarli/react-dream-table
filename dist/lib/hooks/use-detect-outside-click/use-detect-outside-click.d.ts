import React from "react";
/**
 * A hook that fires when the area outside the current element is clicked.
 * @param refObject A collection of ref objects or a single ref.
 * @param callback Function to execute on click.
 */
export declare function useDetectOutsideClick<TRef>(elementRef: React.RefObject<TRef>, callback?: (event: MouseEvent, key?: string) => void): void;
