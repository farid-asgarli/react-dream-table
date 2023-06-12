import { ButtonHTMLAttributes } from "react";
export default function ExpandButton({ isExpanded, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & {
    isExpanded?: boolean;
}): JSX.Element;
