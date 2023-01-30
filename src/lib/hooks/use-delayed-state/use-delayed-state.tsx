import { useEffect, useRef, useState } from "react";

export default function useDelayedState<State>(initialState: State) {
  const [state, setState] = useState(initialState);
  const timeoutRef = useRef<NodeJS.Timeout | null>();

  const setStateAfter = (newState: State, delay: number) => {
    if (delay === 0 || delay === undefined) {
      setState(newState);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setState(newState);
        timeoutRef.current = null;
      }, delay);
    }
  };

  const cancelSetState = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return [state, setStateAfter, cancelSetState] as [State, (newState: State, delay: number) => void, () => void];
}
