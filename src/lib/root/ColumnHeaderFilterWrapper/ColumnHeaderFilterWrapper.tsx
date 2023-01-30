import React from "react";
import { useDataGridContext } from "../../context/DataGridContext";
import { ConstProps } from "../../static/constantProps";
import { ColumnHeaderProps } from "../../types/Elements";
import { cs } from "../../utils/ConcatStyles";
import "./ColumnHeaderFilterWrapper.css";

export default function ColumnHeaderFilterWrapper({
  filterFnsProps,
  children,
  columnKey,
  ...props
}: React.HtmlHTMLAttributes<HTMLDivElement> & {
  filterFnsProps: ColumnHeaderProps<any>["filterFnsProps"];
  columnKey: string;
}) {
  const { icons } = useDataGridContext();
  return (
    <div className="column-header-filter-wrapper" {...props}>
      {filterFnsProps && (
        <button
          className={cs(
            "filter-functions-menu-button",
            (filterFnsProps?.activeFilterMenuKey === columnKey ||
              filterFnsProps.getColumnFilterFn(columnKey) !== ConstProps.defaultActiveFns) &&
              "active"
          )}
          onClick={(e) =>
            filterFnsProps?.displayFilterFnsMenu({
              data: null,
              position: {
                xAxis: e.clientX + 10,
                yAxis: e.clientY + 30,
              },
              identifier: columnKey,
            })
          }
        >
          <icons.Filter className="filter-functions-menu-icon" />
        </button>
      )}
      {children}
    </div>
  );
}
