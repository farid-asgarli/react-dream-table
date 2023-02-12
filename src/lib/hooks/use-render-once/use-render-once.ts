import { useEffect, useRef } from "react";

export function useRenderOnce(fn: () => void) {
  const renderCount = useRef<number>(0);
  useEffect(() => {
    if (renderCount.current > 0) return;
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
