type Throttled<TCallback extends (...args: any[]) => any> = TCallback & {
    cancel: () => void;
};
/**
 * Animation-frame based function that reduces number of function calls when UI event occurs.
 * @param callback A callback function to execute.
 * @returns Throttled function that can be cancelled.
 */
export declare function animationThrottle<TCallback extends (...args: any[]) => any>(callback: TCallback): Throttled<TCallback>;
export {};
