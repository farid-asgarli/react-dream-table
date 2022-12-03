import SearchIcon from "../../../../icons/Search";
import React, { ButtonHTMLAttributes } from "react";
import { concatStyles } from "../../../../utils/ConcatStyles";

export default function SearchButton({
  iconProps,
  ...buttonProps
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  iconProps?: React.SVGProps<SVGSVGElement>;
}) {
  return (
    <button type="button" title="Filter" className={"search-button"} {...buttonProps}>
      <SearchIcon {...iconProps} className={concatStyles("search-icon", iconProps?.className)} />
    </button>
  );
}
