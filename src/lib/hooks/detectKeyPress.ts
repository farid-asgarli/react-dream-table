import { useEffect } from "react";

export function useDetectKeyPress(callback: (key: string, event: KeyboardEvent) => void) {
  function handleKeyPress(e: KeyboardEvent) {
    callback(e.key, e);
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);
}
