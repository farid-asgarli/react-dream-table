import ArrowUpIcon from "../../../../icons/ArrowUp";
import ArrowDownIcon from "../../../../icons/ArrowDown";
import ClearSortingIcon from "../../../../icons/ClearSorting";
import React, { ButtonHTMLAttributes, useMemo } from "react";
import { concatStyles } from "../../../../utils/ConcatStyles";
import { SortDirectionType } from "../../../../types/Utils";

export default function SortButton({
  sortingDirection,
  ...buttonProps
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  iconProps?: React.SVGProps<SVGSVGElement>;
  sortingDirection: SortDirectionType;
}) {
  const renderSortIcon = useMemo(() => {
    switch (sortingDirection) {
      case "ascending":
        return <ArrowDownIcon className={concatStyles("action-icon")} />;
      case "descending":
        return <ClearSortingIcon className={concatStyles("action-icon")} />;
      default:
        return <ArrowUpIcon className={concatStyles("action-icon")} />;
    }
  }, [sortingDirection]);

  return (
    <button
      type="button"
      title="Sort"
      className={concatStyles("action-button", sortingDirection !== undefined && "active")}
      {...buttonProps}
    >
      {renderSortIcon}
    </button>
  );
}
