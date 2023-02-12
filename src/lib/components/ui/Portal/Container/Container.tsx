import React, { useEffect, useRef, useState } from "react";
import { cs } from "../../../../utils/ConcatStyles";

export default function Container({
  children,
  className,
  activeWindowIndex,
  indexOrder,
  animationVariant = "slide",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  activeWindowIndex: string | undefined;
  indexOrder?: string[];
  animationVariant?: "slide" | "zoom";
}) {
  const [flow, setFlow] = useState<"in" | "out">();
  const [__internalIndex, __setInternalIndex] = useState(activeWindowIndex);
  const prevIndex = useRef<string | undefined>(activeWindowIndex);

  function updateFlow(value: "in" | "out") {
    if (flow !== value) setFlow(value);
  }

  useEffect(() => {
    if (activeWindowIndex === prevIndex.current) return;
    if (indexOrder && activeWindowIndex && prevIndex.current) {
      if (indexOrder.indexOf(prevIndex.current) < indexOrder.indexOf(activeWindowIndex)) updateFlow("in");
      else updateFlow("out");
    }
    __setInternalIndex(activeWindowIndex);
    prevIndex.current = activeWindowIndex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWindowIndex, indexOrder]);

  return (
    <div className={cs("portal-container", className)} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && (child.type as any).displayName === "PortalWindow") {
          return (
            child.props.index &&
            __internalIndex === child.props.index &&
            React.cloneElement(child, { ...child.props, "data-id": __internalIndex, animationVariant, animationType: flow })
          );
        } else throw new Error("Not a valid element supplied for children.");
      })}
    </div>
  );
}

Container.displayName = "PortalContainer";
