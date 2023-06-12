import React from "react";
import "./ColumnResizer.scss";
declare function ColumnResizer({ className, updateColumnWidth, updateColumnResizingStatus, containerHeight, columnWidth, columnKey, ...props }: React.HtmlHTMLAttributes<HTMLDivElement> & {
    updateColumnWidth: (key: string, width: number) => void;
    updateColumnResizingStatus: (val: boolean) => void;
    columnKey: string;
    containerHeight?: number;
    columnWidth: number;
}): JSX.Element;
export default ColumnResizer;
