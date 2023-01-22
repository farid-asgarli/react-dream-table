import { HTMLAttributes } from "react";
import { ColumnType, ColumnVisibilityProps, KeyLiteralType, TablePaginationProps } from "./Table";

export type ContextMenuListItem = {
  content?: React.ReactNode;
  key?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export type ContextMenuVisibility<InternalType> = {
  data?: InternalType;
  position?: {
    xAxis: number;
    yAxis: number;
  };
  visible: boolean;
  area?: "body" | "header";
};

export type ContextMenuProps = {
  elements: (ContextMenuListItem | undefined)[];
  visible: boolean;
  onHide?: (visible: boolean) => void;
};

export interface ColumnTypeExtended<DataType> extends Omit<ColumnType<DataType>, "width"> {
  type: "select" | "context" | "expand" | "data";
  pinned?: "left" | "right" | undefined;
  width: number;
}
export type TableRowKeyType = string | number;
export type IPrefetchedFilter<DataType> = Record<KeyLiteralType<DataType>, string[]>;
export type IFilterInputCollection<DataType> = Record<KeyLiteralType<DataType>, string | undefined>;
export type ICurrentFilterCollection<DataType> = Record<KeyLiteralType<DataType>, Set<string> | string | undefined>;
export type ICurrentSorting<DataType> = {
  key: KeyLiteralType<DataType>;
  direction: SortDirectionType;
};

export type SortDirectionType = "ascending" | "descending" | undefined;

export type DataFetchingType = "pagination" | "filter-fetch" | "filter-select" | "sort";

export type TableStyleProps = React.CSSProperties & {
  "--color-primary": string | undefined;
  "--color-hover": string | undefined;
  "--border-radius-lg": string | undefined;
  "--border-radius-md": string | undefined;
  "--border-radius-sm": string | undefined;
  "--box-shadow-main": string | undefined;
};

export type SettingsMenuProps<DataType> = HTMLAttributes<HTMLDivElement> & {
  visibleColumnKeys: Set<KeyLiteralType<DataType>>;
  visible: boolean;
  handleColumnVisibility(key: KeyLiteralType<DataType>): Set<KeyLiteralType<DataType>>;
};

export type FooterProps<DataType> = {
  paginationProps: TablePaginationProps;
  updatePaginationProps: (valuesToUpdate: TablePaginationProps) => void;
  onPaginationChange?: (props: TablePaginationProps) => void;
  progressReporters: Set<DataFetchingType>;
  paginationDefaults?: {
    pageSizes?: Array<number>;
    defaultCurrentPage?: number;
    defaultPageSize?: number;
  };
  settingsMenu: {
    props: Omit<SettingsMenuProps<DataType>, "visible">;
    visibility:
      | {
          visible: boolean;
          position:
            | {
                x: number;
                y: number;
              }
            | undefined;
        }
      | undefined;
    displaySettingsMenu(e: React.MouseEvent<HTMLButtonElement>): void;
    hideSettingsMenu(): void;
  };
  columnVisibilityOptions: ColumnVisibilityProps<DataType> | undefined;
  selectedRows: Set<TableRowKeyType>;
  loading?: boolean | undefined;
};

export type FilteringProps = {
  handleChangeFilterInput?: (key: string, value: string | Set<string>) => void;
  currentValue?: string | Set<string>;
  fetchFilters?: (key: string) => Promise<void>;
  prefetchedFilters?: Record<string, string[]>;
  type?: "input" | "select";
  render?: (text: string) => React.ReactNode;
  multiple?: boolean | undefined;
  progressReporters: Set<DataFetchingType>;
  searchInputProps?: ((key: string) => React.InputHTMLAttributes<HTMLInputElement>) | undefined;
  renderCustomInput?: (handleChange: (key: string, value: any | Set<any>) => void, value: any) => React.ReactNode;
};
