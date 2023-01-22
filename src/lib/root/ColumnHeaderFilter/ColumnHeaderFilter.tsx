import FilterMenu from "../../components/ui/FilterMenu/FilterMenu";
import { ColumnHeaderFilterProps } from "../../types/Elements";
import "./ColumnHeaderFilter.css";

export default function ColumnHeaderFilter({ filteringProps, columnKey, ...props }: ColumnHeaderFilterProps) {
  return (
    <div className="column-header-filter" {...props}>
      {filteringProps && <FilterMenu columnKey={columnKey} filterInputProps={filteringProps} />}
    </div>
  );
}
