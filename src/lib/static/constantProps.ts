import { CompleteFilterFnType } from "../types/Utils";

export const ConstProps = {
  defaultActiveFns: "contains" as CompleteFilterFnType,
  defaultPaginationCurrentPage: 1,
  defaultPaginationPageSize: 10,
  defaultPickerLocale: "en" as const,
  defaultPreRenderedRows: 6,
};
