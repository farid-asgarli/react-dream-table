import React from "react";
declare type RefKeyObject<TRef> = {
    readonly key: string;
    readonly ref: React.RefObject<TRef>;
};
/**
 * A hook that fires when the area outside the current element is clicked.
 * @param refObject A collection of ref objects or a single ref.
 * @param callback Function to execute on click.
 */
export declare function useDetectOutsideClick<TRef>(refObject: RefKeyObject<TRef>[], callback?: (event: MouseEvent, key?: string) => void): void;
export {};
