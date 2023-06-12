import { ButtonHTMLAttributes } from "react";
import "./CollapseAllButton.scss";
export default function CollapseAllButton({ isExpanded, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & {
    isExpanded?: boolean;
}): JSX.Element;
