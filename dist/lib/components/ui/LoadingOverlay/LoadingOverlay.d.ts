import React from "react";
import { ContextLocalization } from "../../../types/Table";
export default function LoadingOverlay({ visible, localization, ...props }: React.HTMLAttributes<HTMLDivElement> & {
    visible: boolean;
    localization: ContextLocalization;
}): JSX.Element;
