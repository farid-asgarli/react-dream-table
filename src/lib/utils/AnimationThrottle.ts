type Throttled<TCallback extends (...args: any[]) => any> = TCallback & { cancel: () => void };

/**
 * Animation-frame based function that reduces number of function calls when UI event occurs.
 * @param callback A callback function to execute.
 * @returns Throttled function that can be cancelled.
 */
export function animationThrottle<TCallback extends (...args: any[]) => any>(callback: TCallback): Throttled<TCallback> {
  let requestId: number | null = null;
  let cbArgs: any[];

  const later = (context: TCallback) => () => {
    requestId = null;
    callback.apply(context, cbArgs);
  };

  const throttled = function (this: TCallback, ...args: any[]) {
    cbArgs = args;
    if (requestId === null) {
      requestId = requestAnimationFrame(later(this));
    }
  };

  throttled.cancel = () => {
    if (requestId !== null) {
      cancelAnimationFrame(requestId);
      requestId = null;
    }
  };

  return throttled as Throttled<TCallback>;
}
