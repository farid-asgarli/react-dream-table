import { useDataGridStaticContext } from "../../context/DataGridStaticContext";
import { ColumnHeaderFilterWrapperProps } from "../../types/Elements";
import { cs } from "../../utils/ConcatStyles";
import "./ColumnHeaderFilterWrapper.scss";

export default function ColumnHeaderFilterWrapper({ filterFnsProps, children, columnKey, ...props }: ColumnHeaderFilterWrapperProps) {
  const { icons, localization } = useDataGridStaticContext();
  return (
    <div className="column-header-filter-wrapper" {...props}>
      {filterFnsProps && (
        <button
          className={cs(
            "action-button visible",
            "filter-functions-menu-button",
            filterFnsProps.isFilterFnActive(columnKey, filterFnsProps.activeFilterMenuKey) && "active"
          )}
          title={localization.filterFunctions}
          type="button"
          onClick={(e) =>
            filterFnsProps?.displayFilterFnsMenu({
              data: {},
              position: {
                xAxis: e.clientX + 10,
                yAxis: e.clientY + 30,
              },
              identifier: columnKey,
            })
          }
        >
          <icons.FilterMenu className="action-icon" />
        </button>
      )}
      {children}
    </div>
  );
}
