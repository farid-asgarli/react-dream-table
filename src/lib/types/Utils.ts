import { HTMLAttributes } from "react";
import { DisplayActionsMenu } from "../logic/tools/actions-menu-factory";
import { ColumnDefinition, ColumnVisibilityProps, InputFiltering, KeyLiteralType, DataGridPaginationProps } from "./DataGrid";

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

export interface ColumnDefinitionExtended<DataType> extends Omit<ColumnDefinition<DataType>, "width"> {
  type: "select" | "actions" | "expand" | "data";
  pinned?: "left" | "right" | undefined;
  key: string;
  width: number;
}

export type BaseFilterFnDefinition =
  | "equals"
  | "notEquals"
  | "greaterThan"
  | "lessThan"
  | "greaterThanOrEqualTo"
  | "lessThanOrEqualTo"
  | "between"
  | "betweenInclusive"
  | "empty"
  | "notEmpty";

export type OptionalFilterFnDefinition = "contains" | "startsWith" | "endsWith" | "fuzzy";
export type CompleteFilterFnDefinition = BaseFilterFnDefinition | OptionalFilterFnDefinition;

export type DataGridRowKeyDefinition = string | number;
export type IPrefetchedFilter = Record<string, string[]>;
export type ICurrentFnCollection = Record<string, CompleteFilterFnDefinition>;
export type ICurrentFilterCollection = Record<string, Array<string> | string | undefined>;
export interface ICurrentSorting {
  key: string;
  direction: SortDirectionDefinition;
}

export type SortDirectionDefinition = "ascending" | "descending" | undefined;

export type DataFetchingDefinition = "pagination" | "filter-fetch" | "filter-select" | "sort";

export interface DataGridStyleProps extends React.CSSProperties {
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
  toggleFullScreenMode: (() => void) | undefined;
  hideMenu: () => void;
}

export interface FooterProps<DataType> {
  paginationProps: DataGridPaginationProps;
  updatePaginationProps: (valuesToUpdate: DataGridPaginationProps) => void;
  onPaginationChange?: (props: DataGridPaginationProps) => void;
  progressReporters: Set<DataFetchingDefinition>;
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
  selectedRows: Set<DataGridRowKeyDefinition>;
  loading?: boolean | undefined;
  toggleFullScreenMode: (() => void) | undefined;
}

export interface FilteringProps {
  updateFilterValue: (key: string, value: string | Array<string>) => void;
  getColumnFilterValue: (key: string) => string | Array<string>;
  fetchFilters?: (key: string) => Promise<void>;
  prefetchedFilters?: Record<string, string[]>;
  type?: "text" | "date" | "number" | "select";
  render?: (text: string) => React.ReactNode;
  multiple?: boolean | undefined;
  progressReporters: Set<DataFetchingDefinition>;
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
