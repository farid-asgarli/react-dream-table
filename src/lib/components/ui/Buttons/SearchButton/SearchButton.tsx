import SearchIcon from "../../../../icons/Search";
import React, { ButtonHTMLAttributes } from "react";
import { concatStyles } from "../../../../utils/ConcatStyles";
import { useTableContext } from "../../../../context/TableContext";

export default function SearchButton({
  className,
  isActive,
  isVisible,
  ...buttonProps
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean;
  isVisible?: boolean;
}) {
  const { localization } = useTableContext();
  return (
    <button
      type="button"
      title={localization.filterButtonTitle}
      className={concatStyles("action-button", isActive && "active", isVisible && "visible", className)}
      {...buttonProps}
    >
      <SearchIcon className={concatStyles("action-icon")} />
    </button>
  );
}
