import { ConstProps } from "../static/constantProps";
import { ColumnDefinition, InputFiltering } from "../types/DataGrid";
import { CompleteFilterFnDefinition, GridDataType, ICurrentFnCollection } from "../types/Utils";

export const assignFilterFns = <DataType extends GridDataType>(columns: ColumnDefinition<DataType>[]) => {
  let filterFnsObj: ICurrentFnCollection = {};
  const fnsColumns = columns.filter((col) => col.filter && col.filteringProps?.type !== "select");

  for (let index = 0; index < fnsColumns.length; index++) {
    const col = fnsColumns[index];
    const defaultFilter: CompleteFilterFnDefinition = col.filteringProps?.type === "date" ? "equals" : ConstProps.defaultActiveFn;
    filterFnsObj[col.key as string] = (col.filteringProps as InputFiltering)?.defaultFilterFn ?? defaultFilter;
  }

  return filterFnsObj;
};
