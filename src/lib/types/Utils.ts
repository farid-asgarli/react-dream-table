import { HTMLAttributes } from "react";
import { DisplayActionsMenu } from "../logic/tools/actions-menu-factory";
import { ColumnType, ColumnVisibilityProps, InputFiltering, KeyLiteralType, TablePaginationProps } from "./Table";

export interface ActionsMenuListItem {
  content?: React.ReactNode;
  key?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  isSelected?: boolean;
}

export interface ActionsMenuProps {
  visible: boolean;
  onHide?: (visible: boolean) => void;
  children: React.ReactNode | Array<ActionsMenuListItem | undefined>;
}

export interface ColumnTypeExtended<DataType> extends Omit<ColumnType<DataType>, "width"> {
  type: "select" | "actions" | "expand" | "data";
  pinned?: "left" | "right" | undefined;
  key: string;
  width: number;
}
export type BaseFilterFnType =
  | "equals"
  | "equalsAlt"
  | "notEquals"
  | "greaterThan"
  | "lessThan"
  | "greaterThanOrEqualTo"
  | "lessThanOrEqualTo"
  | "between"
  | "betweenInclusive";

export type OptionalFilterFnType = "contains" | "startsWith" | "endsWith";
export type CompleteFilterFnType = BaseFilterFnType | OptionalFilterFnType;

export type TableRowKeyType = string | number;
export type IPrefetchedFilter = Record<string, string[]>;
export type ICurrentFnType = Record<string, CompleteFilterFnType>;
export type ICurrentFilterCollection = Record<string, Array<string> | string | undefined>;
export interface ICurrentSorting {
  key: string;
  direction: SortDirectionType;
}

export type SortDirectionType = "ascending" | "descending" | undefined;

export type DataFetchingType = "pagination" | "filter-fetch" | "filter-select" | "sort";

export interface TableStyleProps extends React.CSSProperties {
  "--color-primary": string | undefined;
  "--color-hover": string | undefined;
  "--border-radius-lg": string | undefined;
  "--border-radius-md": string | undefined;
  "--border-radius-sm": string | undefined;
  "--box-shadow-main": string | undefined;
  "--scrollbar-width": string | undefined;
}

export interface OptionsMenuProps<DataType> extends HTMLAttributes<HTMLDivElement> {
  visibleColumnKeys: Set<KeyLiteralType<DataType>>;
  handleColumnVisibility(key: KeyLiteralType<DataType>): Set<KeyLiteralType<DataType>>;
}

export interface FooterProps<DataType> {
  paginationProps: TablePaginationProps;
  updatePaginationProps: (valuesToUpdate: TablePaginationProps) => void;
  onPaginationChange?: (props: TablePaginationProps) => void;
  progressReporters: Set<DataFetchingType>;
  paginationDefaults?: {
    pageSizes?: Array<number>;
    defaultCurrentPage?: number;
    defaultPageSize?: number;
  };
  optionsMenu: {
    displayOptionsMenu: DisplayActionsMenu<any>;
    isMenuVisible: boolean;
  };
  columnVisibilityOptions: ColumnVisibilityProps<DataType> | undefined;
  selectedRows: Set<TableRowKeyType>;
  loading?: boolean | undefined;
}

export interface FilteringProps {
  updateFilterValue: (key: string, value: string | Array<string>) => void;
  getColumnFilterValue: (key: string) => string | Array<string>;
  fetchFilters?: (key: string) => Promise<void>;
  prefetchedFilters?: Record<string, string[]>;
  type?: "text" | "date" | "number" | "select";
  render?: (text: string) => React.ReactNode;
  multiple?: boolean | undefined;
  progressReporters: Set<DataFetchingType>;
  filterInputProps?: ((key: string) => React.InputHTMLAttributes<HTMLInputElement>) | undefined;
  renderCustomInput?: InputFiltering["renderCustomInput"];
  isRangeInput: boolean;
  disableInputIcon: boolean;
  pickerLocale?: "en" | "az";
}

export interface ScrollPosition {
  left: number;
  top: number;
}
