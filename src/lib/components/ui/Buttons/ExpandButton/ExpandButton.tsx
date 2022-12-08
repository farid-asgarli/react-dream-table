import React, { ButtonHTMLAttributes } from "react";
import PlusIcon from "../../../../icons/Plus";
import { concatStyles } from "../../../../utils/ConcatStyles";

export default function ExpandButton({
  isExpanded,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  isExpanded?: boolean;
}) {
  return (
    <button className={concatStyles("expand-button", isExpanded && "active")} {...props}>
      <PlusIcon className="expand-icon" />
    </button>
  );
}
