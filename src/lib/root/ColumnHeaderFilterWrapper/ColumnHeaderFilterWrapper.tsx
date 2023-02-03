import { useDataGridStaticContext } from "../../context/DataGridStaticContext";
import { ColumnHeaderFilterWrapperProps } from "../../types/Elements";
import { cs } from "../../utils/ConcatStyles";
import "./ColumnHeaderFilterWrapper.css";

export default function ColumnHeaderFilterWrapper({ filterFnsProps, children, columnKey, ...props }: ColumnHeaderFilterWrapperProps) {
  const { icons } = useDataGridStaticContext();
  return (
    <div className="column-header-filter-wrapper" {...props}>
      {filterFnsProps && (
        <button
          className={cs(
            "filter-functions-menu-button",
            filterFnsProps.isFilterFnActive(columnKey, filterFnsProps.activeFilterMenuKey) && "active"
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
