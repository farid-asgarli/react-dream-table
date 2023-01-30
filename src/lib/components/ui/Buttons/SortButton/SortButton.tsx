import React, { ButtonHTMLAttributes, useMemo } from "react";
import { cs } from "../../../../utils/ConcatStyles";
import { SortDirectionType } from "../../../../types/Utils";
import { useDataGridContext } from "../../../../context/DataGridContext";

export default function SortButton({
  sortingDirection,
  ...buttonProps
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  iconProps?: React.SVGProps<SVGSVGElement>;
  sortingDirection: SortDirectionType;
}) {
  const { localization, icons } = useDataGridContext();

  const renderSortIcon = useMemo(() => {
    switch (sortingDirection) {
      case "ascending":
        return <icons.ArrowDown className={cs("action-icon")} />;
      case "descending":
        return <icons.ClearSorting className={cs("action-icon")} />;
      default:
        return <icons.ArrowUp className={cs("action-icon")} />;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortingDirection]);

  const renderSortTitle = useMemo(() => {
    switch (sortingDirection) {
      case "ascending":
        return localization.descendingSortTitle;
      case "descending":
        return localization.clearSortTitle;
      default:
        return localization.ascendingSortTitle;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortingDirection]);

  return (
    <button
      type="button"
      title={renderSortTitle}
      className={cs("action-button", sortingDirection !== undefined && "active")}
      {...buttonProps}
    >
      {renderSortIcon}
    </button>
  );
}
