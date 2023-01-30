import FilterMenu from "../../components/ui/FilterMenu/FilterMenu";
import { ColumnHeaderFilterProps } from "../../types/Elements";
import "./ColumnHeaderFilter.css";

export default function ColumnHeaderFilter({ filterProps, columnKey, ...props }: ColumnHeaderFilterProps) {
  return (
    <div className="column-header-filter" {...props}>
      {filterProps && <FilterMenu columnKey={columnKey} filterProps={filterProps} />}
    </div>
  );
}
