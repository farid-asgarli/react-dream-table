import React from "react";
import "./LoadingSkeleton.scss";
export default function LoadingSkeleton({ className, style, containerHeight, visible, ...props }: React.HtmlHTMLAttributes<HTMLDivElement> & {
    containerHeight: number;
    visible: boolean;
}): JSX.Element;
