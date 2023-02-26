import React from "react";
import { cs } from "../../../../utils/ConcatStyles";
import { Animations } from "../../../animations/Animations";
export default function Window({
  children,
  index,
  className,
  animationType,
  animationVariant,
  onAnimationFinish,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  index: string;
  animationType?: "in" | "out";
  animationVariant?: "zoom" | "slide";
  onAnimationFinish?: (val: boolean) => void;
}) {
  return (
    <Animations.Manual duration={300} type={animationType} variant={animationVariant} onAnimationFinish={onAnimationFinish}>
      <div id={index} className={cs("portal-window", className)} {...props}>
        {children}
      </div>
    </Animations.Manual>
  );
}

Window.displayName = "PortalWindow";
