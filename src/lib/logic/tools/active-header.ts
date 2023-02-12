import { useCallback, useState } from "react";

export default function useActiveHeaders() {
  const [activeHeader, setActiveHeader] = useState<string>();

  function updateActiveHeader(key: string | undefined) {
    activeHeader !== key && setActiveHeader(key);
  }

  const isHeaderIsActive = useCallback(
    (key: string) => {
      return activeHeader !== undefined && activeHeader === key;
    },
    [activeHeader]
  );

  return { updateActiveHeader, isHeaderIsActive };
}
