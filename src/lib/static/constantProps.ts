import { CompleteFilterFnDefinition } from "../types/Utils";

export const ConstProps = {
  defaultActiveFn: "contains" as CompleteFilterFnDefinition,
  defaultActiveDateFn: "equals" as CompleteFilterFnDefinition,
  defaultPaginationCurrentPage: 1,
  defaultPaginationPageSize: 10,
  defaultPickerLocale: "en" as const,
  defaultPreRenderedRows: 6,
  defaultRangeFns: ["between", "betweenInclusive"] as CompleteFilterFnDefinition[],
  defaultFnsNoFilter: ["empty", "notEmpty"] as CompleteFilterFnDefinition[],
};
