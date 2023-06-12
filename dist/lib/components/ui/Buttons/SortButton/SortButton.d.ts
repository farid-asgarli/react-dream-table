import React, { ButtonHTMLAttributes } from "react";
import { SortDirectionDefinition } from "../../../../types/Utils";
export default function SortButton({ sortingDirection, ...buttonProps }: ButtonHTMLAttributes<HTMLButtonElement> & {
    iconProps?: React.SVGProps<SVGSVGElement>;
    sortingDirection: SortDirectionDefinition;
}): JSX.Element;
