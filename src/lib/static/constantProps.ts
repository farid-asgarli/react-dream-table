import { CompleteFilterFnDefinition, DefaultDataGridLocale } from "../types/Utils";

export const ConstProps = {
  defaultPaginationCurrentPage: 1,
  defaultPaginationPageSize: 10,
  defaultPreRenderedRows: 5,
  defaultLocale: "en" as DefaultDataGridLocale,
  defaultActiveFn: "contains" as CompleteFilterFnDefinition,
  defaultActiveDateFn: "equals" as CompleteFilterFnDefinition,
  defaultRangeFns: ["between", "betweenInclusive"] as CompleteFilterFnDefinition[],
  defaultFnsNoFilter: ["empty", "notEmpty"] as CompleteFilterFnDefinition[],
};

export const DefaultDateDelimiter = "/";
export const DefaultDateTemplate = `DD${DefaultDateDelimiter}MM${DefaultDateDelimiter}YYYY`;
