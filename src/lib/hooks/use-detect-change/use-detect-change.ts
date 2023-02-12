import { useEffect } from "react";

export default function useDetectChange<T>(state: T) {
  useEffect(() => console.log(state), [state]);
}
