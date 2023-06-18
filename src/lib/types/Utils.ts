import { HTMLAttributes } from "react";
import { LocalizationEntries } from "../static/localization";
import useDataGridTools from "../logic/tools/data-grid-tools";
import { DisplayActionsMenu } from "../logic/tools/actions-menu-factory";
import { useDataManagement } from "../logic/data-management/dataManagement";
import { ColumnDefinition, InputFiltering, KeyLiteralType, DataGridPaginationProps, SettingsMenuProps } from "./DataGrid";

export interface GridTools<DataType extends GridDataType> extends ReturnType<typeof useDataGridTools<DataType>> {
  getColumnByKey(key: string): ColumnDefinitionExtended<DataType> | undefined;
}

export type DataTools<DataType extends GridDataType> = ReturnType<typeof useDataManagement<DataType>>;

export interface GroupedColumnHeaderDefinition {
  width: number;
  title: string | undefined;
  keys: string[];
}

export type GroupedColumnHeaderCollection = {
  unlockedGroupedColumnHeaders: GroupedColumnHeaderDefinition[] | undefined;
  leftLockedGroupedColumnHeaders: GroupedColumnHeaderDefinition[] | undefined;
  rightLockedGroupedColumnHeaders: GroupedColumnHeaderDefinition[] | undefined;
};

export interface BaseActionsMenuListItemProps {
  content?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  isSelected?: boolean;
  className?: string | undefined;
  renderCustomComponent?: React.ReactNode;
}

export interface ActionsMenuListItem extends BaseActionsMenuListItemProps {
  subMenu?: {
    items: BaseActionsMenuListItemProps[];
  };
}

export interface ActionsMenuProps {
  visible: boolean;
  onHide?: (visible: boolean) => void;
  children: React.ReactNode | Array<ActionsMenuListItem | undefined>;
  updatePosition: () => void;
}

export interface ColumnDefinitionExtended<DataType extends GridDataType> extends Omit<ColumnDefinition<DataType>, "width"> {
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

export type SelectFilterOptionType = { label: string; value: any };

export type DataGridRowKeyDefinition = string | number;
export type IPrefetchedFilter = Record<string, Array<SelectFilterOptionType>>;
export type ICurrentFnCollection = Record<string, CompleteFilterFnDefinition>;
export type ICurrentFilterCollection = Record<string, Array<string> | string | undefined>;
export interface ICurrentSorting {
  key: string;
  direction: SortDirectionDefinition;
}

export type SortDirectionDefinition = "ascending" | "descending" | undefined;

export type DataFetchingDefinition = "pagination" | "filter-fetch" | "filter-select" | "sort";

export interface DataGridStyleProps extends React.CSSProperties {
  "--grid-color-primary": string | undefined;
  "--grid-color-hover": string | undefined;
  "--grid-border-radius-lg": string | undefined;
  "--grid-border-radius-md": string | undefined;
  "--grid-border-radius-sm": string | undefined;
  "--grid-box-shadow-main": string | undefined;
  "--grid-scrollbar-width": string | undefined;
}

export type DefaultDataGridLocale = keyof typeof LocalizationEntries;

export interface OptionsMenuProps<DataType extends GridDataType> extends HTMLAttributes<HTMLDivElement> {
  visibleColumnKeys: Set<KeyLiteralType<DataType>>;
  isDarkModeEnabled: boolean;
  isFullScreenModeEnabled: boolean;
  isFilterMenuVisible: boolean;
  isColumnGroupingEnabled: boolean;
  isColumnVisibilityEnabled: boolean;
  isColumnFilteringEnabled: boolean;
  updateActiveHeader: (key: string | undefined) => void;
  updateColumnVisibility(key: KeyLiteralType<DataType>): Set<KeyLiteralType<DataType>>;
  updateDarkMode(): void;
  updateFullScreenMode(): void;
  updateFilterMenuVisibility(): void;
  updateColumnGrouping(): void;
  updatePosition(): void;
  optionsMenuProps: SettingsMenuProps | undefined;
}

export interface FooterProps {
  paginationProps: {
    gridPaginationProps: DataGridPaginationProps;
    updateCurrentPagination: (valuesToUpdate: DataGridPaginationProps) => void;
    paginationDefaults?: {
      pageSizes?: Array<number>;
      defaultCurrentPage?: number;
      defaultPageSize?: number;
    };
  };
  progressReporters: Set<DataFetchingDefinition>;
  optionsMenu: {
    displayOptionsMenu: DisplayActionsMenu<any>;
    isMenuVisible: boolean;
    enabled: boolean;
  };
  selectedRows: Set<DataGridRowKeyDefinition>;
  loading?: boolean | undefined;
}

export interface FilteringProps {
  updateFilterValue: (key: string, value: string | Array<string>) => void;
  getColumnFilterValue: (key: string) => string | Array<string>;
  fetchFilters?: (key: string) => Promise<void>;
  prefetchedFilters?: Record<string, SelectFilterOptionType[]>;
  type?: "text" | "date" | "number" | "select";
  render?: (label: string, value: any) => React.ReactNode;
  multiple?: boolean | undefined;
  progressReporters: Set<DataFetchingDefinition>;
  filterInputProps?: ((key: string) => React.InputHTMLAttributes<HTMLInputElement>) | undefined;
  renderCustomInput?: InputFiltering["renderCustomInput"];
  isRangeInput: boolean;
  disableInputIcon: boolean;
}

export type IndexedData<DataType = GridDataType> = DataType & {
  __virtual_row_index: number;
};

export type GridDataType = Record<string, any>;

export interface ScrollPosition {
  left: number;
  top: number;
}
