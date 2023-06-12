import React, { useRef, useState } from "react";

export default function useStateWRef<S, R = S extends undefined ? S | undefined : S>(initialState?: R) {
  const [state, setState] = useState(initialState);
  const ref = useRef(state);
  ref.current = state;

  return [ref.current as R, setState as React.Dispatch<React.SetStateAction<R>>] as const;
}
