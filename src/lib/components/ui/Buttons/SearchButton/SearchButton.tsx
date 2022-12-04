import SearchIcon from "../../../../icons/Search";
import React, { ButtonHTMLAttributes } from "react";
import { concatStyles } from "../../../../utils/ConcatStyles";

export default function SearchButton({
  className,
  isActive,
  isVisible,
  ...buttonProps
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean;
  isVisible?: boolean;
}) {
  return (
    <button
      type="button"
      title="Filter"
      className={concatStyles("action-button", isActive && "active", isVisible && "visible", className)}
      {...buttonProps}
    >
      <SearchIcon className={concatStyles("action-icon")} />
    </button>
  );
}
