import { ConstProps } from "../static/constantProps";
import { ColumnType, InputFiltering } from "../types/Table";
import { ICurrentFnType } from "../types/Utils";

export const assignFilterFns = (columns: ColumnType<any>[]) => {
  let filterFnsObj: ICurrentFnType = {};
  columns
    .filter((col) => col.filter && col.filteringProps?.type !== "select")
    .forEach((col) => {
      filterFnsObj[col.key as string] =
        (col.filteringProps as InputFiltering)?.defaultFilterFn ?? ConstProps.defaultActiveFns;
    });
  return filterFnsObj;
};
