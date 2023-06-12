/// <reference types="react" />
import { ExpandRowProps } from "../../types/Elements";
import "./ExpandRowWrap.scss";
export default function ExpandRowWrap({ expandRowProps: { children, isRowExpanded, showSeparatorLine, updateExpandRowHeightCache, rowIndex }, className, style, ...props }: ExpandRowProps): JSX.Element;
