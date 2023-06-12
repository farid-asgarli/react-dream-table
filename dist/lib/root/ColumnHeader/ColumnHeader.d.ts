import React from "react";
import { ColumnHeaderProps } from "../../types/Elements";
import { GridDataType } from "../../types/Utils";
import "./ColumnHeader.scss";
declare function ColumnHeader<DataType extends GridDataType>({ resizingProps, columnProps, draggingProps, filterProps, filterFnsProps, children, style, className, toolBoxes, containerHeight, isFilterMenuVisible, ...props }: React.HtmlHTMLAttributes<HTMLDivElement> & ColumnHeaderProps<DataType>): JSX.Element;
export default ColumnHeader;
