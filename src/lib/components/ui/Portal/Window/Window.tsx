import React from "react";
import { cs } from "../../../../utils/ConcatStyles";
import { Animations } from "../../../animations/Animations";
export default function Window({
  children,
  index,
  className,
  animationType,
  animationVariant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  index: string;
  animationType?: "in" | "out";
  animationVariant?: "zoom" | "slide";
}) {
  return (
    <Animations.Manual duration={300} type={animationType} variant={animationVariant}>
      <div id={index} className={cs("portal-window", className)} {...props}>
        {children}
      </div>
    </Animations.Manual>
  );
}

Window.displayName = "PortalWindow";
