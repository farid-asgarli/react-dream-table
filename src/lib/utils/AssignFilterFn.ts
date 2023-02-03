import { ConstProps } from "../static/constantProps";
import { ColumnDefinition, InputFiltering } from "../types/DataGrid";
import { CompleteFilterFnDefinition, ICurrentFnCollection } from "../types/Utils";

export const assignFilterFns = (columns: ColumnDefinition<any>[]) => {
  let filterFnsObj: ICurrentFnCollection = {};
  columns
    .filter((col) => col.filter && col.filteringProps?.type !== "select")
    .forEach((col) => {
      const defaultFilter: CompleteFilterFnDefinition = col.filteringProps?.type === "date" ? "equals" : ConstProps.defaultActiveFn;

      filterFnsObj[col.key as string] = (col.filteringProps as InputFiltering)?.defaultFilterFn ?? defaultFilter;
    });
  return filterFnsObj;
};
