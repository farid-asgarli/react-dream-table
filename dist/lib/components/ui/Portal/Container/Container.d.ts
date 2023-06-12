import React from "react";
declare function Container({ children, className, activeWindowIndex, indexOrder, animationVariant, ...props }: React.HTMLAttributes<HTMLDivElement> & {
    activeWindowIndex: string | undefined;
    indexOrder?: string[];
    animationVariant?: "slide" | "zoom";
}): JSX.Element;
declare namespace Container {
    var displayName: string;
}
export default Container;
