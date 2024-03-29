import React, { ButtonHTMLAttributes } from "react";
import { useDataGridStaticContext } from "../../../../context/DataGridStaticContext";
import { cs } from "../../../../utils/ConcatStyles";

export default function ExpandButton({
  isExpanded,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  isExpanded?: boolean;
}) {
  const { icons } = useDataGridStaticContext();

  return (
    <button type="button" className={cs("data-grid-actions-menu-constructor-button expand-button", isExpanded && "active")} {...props}>
      <icons.ChevronDown className="expand-icon data-grid-actions-menu-constructor-icon" />
    </button>
  );
}
