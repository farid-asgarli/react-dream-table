import React, { useRef, useState } from "react";

export default function useStateWRef<S>(
  initialState?: S | undefined
): [S | undefined, React.Dispatch<React.SetStateAction<S | undefined>>] {
  const [state, setState] = useState(initialState);
  const ref = useRef(state);
  ref.current = state;

  return [ref.current, setState];
}
