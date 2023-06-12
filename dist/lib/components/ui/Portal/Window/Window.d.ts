import React from "react";
declare function Window({ children, index, className, animationType, animationVariant, onAnimationFinish, ...props }: React.HTMLAttributes<HTMLDivElement> & {
    index: string;
    animationType?: "in" | "out";
    animationVariant?: "zoom" | "slide";
    onAnimationFinish?: (val: boolean) => void;
}): JSX.Element;
declare namespace Window {
    var displayName: string;
}
export default Window;
