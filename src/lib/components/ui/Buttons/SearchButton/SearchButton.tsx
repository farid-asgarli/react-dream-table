import React, { ButtonHTMLAttributes } from "react";
import { cs } from "../../../../utils/ConcatStyles";
import { useDataGridContext } from "../../../../context/DataGridContext";

export default function SearchButton({
  className,
  isActive,
  isVisible,
  ...buttonProps
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean;
  isVisible?: boolean;
}) {
  const { localization, icons } = useDataGridContext();
  return (
    <button
      type="button"
      title={localization.filterButtonTitle}
      className={cs("action-button", isActive && "active", isVisible && "visible", className)}
      {...buttonProps}
    >
      <icons.Search className={cs("action-icon")} />
    </button>
  );
}
