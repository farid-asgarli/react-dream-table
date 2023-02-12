import { useEffect, useRef } from "react";

export function useDetectRenderCount<T>(state: T, predicate?: (count: number) => void) {
  const count = useRef<number>(0);
  useEffect(() => {
    count.current++;
    predicate?.(count.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
}
