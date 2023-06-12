/// <reference types="react" />
import { RowProps } from "../../types/Elements";
import "./Row.scss";
export default function Row({ className, style, children, isRowSelected, isRowActive, expandRowProps, tabIndex, totalColumnsWidth, onContextMenu, ...props }: RowProps): JSX.Element;
