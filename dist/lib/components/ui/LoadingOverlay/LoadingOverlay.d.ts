import React from "react";
import "./LoadingOverlay.scss";
export default function LoadingOverlay({ visible, style, ...props }: React.HTMLAttributes<HTMLDivElement> & {
    visible: boolean;
}): JSX.Element;
