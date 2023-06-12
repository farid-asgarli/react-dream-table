import React from "react";
import "./EmptyDataGrid.scss";
export default function EmptyDataGrid({ className, visible, style, ...props }: React.HtmlHTMLAttributes<HTMLDivElement> & {
    visible: boolean;
}): JSX.Element;
