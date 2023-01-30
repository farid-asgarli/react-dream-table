import React, { ButtonHTMLAttributes } from "react";
import { useDataGridContext } from "../../../../context/DataGridContext";
import { cs } from "../../../../utils/ConcatStyles";

export default function ExpandButton({
  isExpanded,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  isExpanded?: boolean;
}) {
  const { icons } = useDataGridContext();

  return (
    <button type="button" className={cs("expand-button", isExpanded && "active")} {...props}>
      <icons.ChevronDown className="expand-icon" />
    </button>
  );
}
