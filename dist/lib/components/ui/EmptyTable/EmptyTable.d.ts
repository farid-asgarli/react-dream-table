import React from "react";
import { ContextLocalization } from "../../../types/Table";
export default function EmptyTable({ localization, ...props }: React.TableHTMLAttributes<HTMLTableElement> & {
    localization: ContextLocalization;
}): JSX.Element;
