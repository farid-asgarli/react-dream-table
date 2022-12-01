import { useRef } from "react";

export const useRenderCounter = () => {
  const renderCount = useRef<number>(0);
  renderCount.current = renderCount.current + 1;

  console.log(renderCount.current);
  return null;
};
