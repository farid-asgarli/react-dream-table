import React, { ButtonHTMLAttributes } from "react";
import { useTableContext } from "../../../../context/TableContext";
import { cs } from "../../../../utils/ConcatStyles";

export default function ExpandButton({
  isExpanded,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  isExpanded?: boolean;
}) {
  const { icons } = useTableContext();

  return (
    <button type="button" className={cs("expand-button", isExpanded && "active")} {...props}>
      <icons.ChevronDown className="expand-icon" />
    </button>
  );
}
