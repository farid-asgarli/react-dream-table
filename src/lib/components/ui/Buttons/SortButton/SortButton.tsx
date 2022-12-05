import ArrowUpIcon from "../../../../icons/ArrowUp";
import ArrowDownIcon from "../../../../icons/ArrowDown";
import ClearSortingIcon from "../../../../icons/ClearSorting";
import React, { ButtonHTMLAttributes, useMemo } from "react";
import { concatStyles } from "../../../../utils/ConcatStyles";
import { SortDirectionType } from "../../../../types/Utils";
import { TableLocalizationType } from "../../../../types/Table";

export default function SortButton({
  sortingDirection,
  localization,
  ...buttonProps
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  iconProps?: React.SVGProps<SVGSVGElement>;
  sortingDirection: SortDirectionType;
  localization?: TableLocalizationType;
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

  const renderSortTitle = useMemo(() => {
    switch (sortingDirection) {
      case "ascending":
        return localization?.descendingSortTitle;
      case "descending":
        return localization?.clearSortTitle;
      default:
        return localization?.ascendingSortTitle;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortingDirection]);

  return (
    <button
      type="button"
      title={renderSortTitle}
      className={concatStyles("action-button", sortingDirection !== undefined && "active")}
      {...buttonProps}
    >
      {renderSortIcon}
    </button>
  );
}
