import { ContextLocalization, TablePaginationProps } from "./Table";

export type ContextMenu = {
  content: React.ReactNode;
  key: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export type ContextMenuVisibility<DataType> = {
  data?: DataType;
  position?: {
    xAxis: number;
    yAxis: number;
  };
  visible: boolean;
};

export type FilterMenuVisibility = {
  key?: string;
  position?: {
    xAxis: number;
    yAxis: number;
  };
  visible: boolean;
};

export type SelectedFilterType = {
  [key: string]: Set<string>;
};

export type FetchedFilterType = Map<string, string[]>;

export type DataFetchingType = "pagination" | "filter-fetch" | "filter-select";

export type ContextMenuProps = {
  elements: (ContextMenu | undefined)[];
  visible: boolean;
  onHide?: (visible: boolean) => void;
};

export type TableStyleProps = React.CSSProperties & {
  "--color-background": string;
  "--color-primary": string;
};

export type TableRowKeyType = string | number;

export type FilterMenuProps = {
  visible: boolean;
  fetchedFilter: Map<string, string[]>;
  updateSelectedFilters(
    key?: string | undefined,
    value?: string | string[] | undefined
  ): Promise<void>;
  updateInputValue: (
    key?: string | undefined,
    value?: string | undefined
  ) => Promise<void>;
  value: string | undefined;
  columnKey: string;
  onHide?: (visible: boolean) => void;
  selectedFilters?: Set<string>;
  isServerSide?: boolean;
  loading?: boolean;
  localization: ContextLocalization;
};

export type PaginationTableProps = {
  paginationProps: TablePaginationProps;
  updatePaginationProps: (
    valuesToUpdate: TablePaginationProps,
    shouldTriggerServerUpdate?: boolean
  ) => void;
  onPaginationChange?: (props: TablePaginationProps) => void;
  fetching: Set<DataFetchingType>;
  localization: ContextLocalization;
  paginationDefaults?: {
    pageSizes?: Array<number>;
    defaultCurrentPage?: number;
    defaultPageSize?: number;
  };
};

export type EllipsisProps = {
  columnHead: boolean;
  rowData: boolean;
};
