import { useEffect, useState } from "react";

export function useDebounce<ValueType>(value: ValueType, delay: number, callBack?: (value: ValueType) => void) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState<ValueType>(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
        callBack?.(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay, callBack] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}
