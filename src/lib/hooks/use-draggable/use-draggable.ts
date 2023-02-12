/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { animationThrottle } from "../../utils/AnimationThrottle";

type DragPosition = { xAxis: number };

const id = (position: DragPosition) => position;

type DraggableHookDefinition = (hookProps: {
  onDrag?: (position: DragPosition) => DragPosition;
  onDragEnd?: (position: DragPosition) => void;
}) => [(elem: HTMLElement | null) => void, boolean];

/**
 * Another resizing hook to adjust width and also drag element on x-axis.
 * Calculation is carried out by the tools to whether set the width or not.
 * Performant solution, based on movementX.
 * Does not cause stutter.
 */

// complex logic should be a hook, not a component
export const useDraggable: DraggableHookDefinition = ({ onDrag = id, onDragEnd } = {}) => {
  const initialState: DragPosition = { xAxis: 0 };

  // this state doesn't change often, so it's fine
  const [pressed, setPressed] = useState(false);

  // do not store position in useState! even if you useEffect on
  // it and update `transform` CSS property, React still rerenders
  // on every state change, and it LAGS
  const position = useRef(initialState);

  // we've moved the code into the hook, and it would be weird to
  // return `ref` and `handleMouseDown` to be set on the same element
  // why not just do the job on our own here and use a function-ref
  // to subscribe to `mousedown` too? it would go like this:
  const ref = useRef<HTMLElement | null>(null);
  const unsubscribe = useRef<any>();

  const legacyRef = useCallback((elem: HTMLElement | null) => {
    ref.current = elem;
    if (unsubscribe.current) {
      unsubscribe.current();
    }
    if (elem) {
      elem.addEventListener("mousedown", handleMouseDown);
      unsubscribe.current = () => {
        elem.removeEventListener("mousedown", handleMouseDown);
      };
    }
  }, []);

  // Recalculate element's relative position and update it only when resizing event starts.
  const currentOffset = useMemo(() => ref.current?.getBoundingClientRect().left ?? 0, [pressed]);

  // handlers must be wrapped into `useCallback`. even though
  // resubscribing to `mousedown` on every tick is quite cheap
  // due to React's event system, `handleMouseDown` might be used
  // in `deps` argument of another hook, where it would really matter.
  // as you never know where return values of your hook might end up,
  // it's just generally a good idea to ALWAYS use `useCallback`
  const handleMouseDown = useCallback(() => setPressed(true), []);

  useEffect(() => {
    // subscribe to mousemove only when pressed, otherwise it will lag
    // even when you're not dragging
    if (!pressed) return;

    // Updating the page without any throttling is a bad idea
    // requestAnimationFrame-based throttle would probably be fine,
    // but be aware that naive implementation might make element
    // lag 1 frame behind cursor, and it will appear to be lagging
    // even at 60 FPS
    const handleMouseMove = animationThrottle((event: MouseEvent) => {
      // needed for TypeScript anyway
      if (!ref.current || !position.current) return;

      const pos = position.current;
      // it's important to save it into variable here,
      // otherwise we might capture reference to an element
      // that was long gone. not really sure what's correct
      // behavior for a case when you've been scrolling, and
      // the target element was replaced. probably some formulae
      // needed to handle that case. // TODO
      const elem = ref.current;
      position.current = onDrag({
        // Previous implementation:
        /** xAxis: event.movementX, */
        // MovementX is a better approach (and API is newer) for listening to
        // mouse events. However, DPI and scaling variety across devices
        // can cause loss of tracking of actual mouse location on the screen.
        xAxis: event.clientX - currentOffset,
      });

      elem.style.transform = `translate3d(${pos.xAxis}px, 0px,0px)`;
    });

    const resetPosition = () => {
      position.current = initialState;
      const elem = ref.current;
      if (elem) elem.style.transform = `translate3d(0px, 0px,0px)`;
    };

    const handleMouseUp = () => {
      setPressed(false);
      onDragEnd?.(position.current);
      resetPosition();
    };
    // subscribe to mousemove and mouseup on document, otherwise you
    // can escape bounds of element while dragging and get stuck
    // dragging it forever
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    // if `onDrag` wasn't defined with `useCallback`, we'd have to
    // resubscribe to 2 DOM events here.
  }, [pressed, onDrag, onDragEnd]);

  // actually it makes sense to return an array only when
  // you expect that on the caller side all of the fields
  // will be usually renamed
  return [legacyRef, pressed];

  // > seems the best of them all to me
  // this code doesn't look pretty anymore, huh?
};
