import React, { HTMLAttributes } from "react";
import { ColumnType, ColumnVisibilityProps, TablePaginationProps } from "./Table";

export type ContextMenu = {
  content: React.ReactNode;
  key: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export type SettingsMenuProps = HTMLAttributes<HTMLDivElement> & {
  visibleColumnKeys: Set<string>;
  visible: boolean;
  handleHeaderVisibility(key: string): Set<string>;
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

export type ISelectedFilter = Record<string, Set<string>>;
export type IPrefetchedFilter = Record<string, string[]>;
export type IFilterInputCollection = Record<string, string | undefined>;
export type IAbstractInputCollection = Record<string, Set<string> | string | undefined>;
export type ISortingFilter = {
  key: string;
  direction: SortDirectionType;
};

export type SortDirectionType = "ascending" | "descending" | undefined;

export type DataFetchingType = "pagination" | "filter-fetch" | "filter-select" | "sort";

export type ContextMenuProps = {
  elements: (ContextMenu | undefined)[];
  visible: boolean;
  onHide?: (visible: boolean) => void;
};

export type TableStyleProps = React.CSSProperties & {
  "--color-background": string | undefined;
  "--color-primary": string | undefined;
  "--border-radius-lg": string;
  "--border-radius-md": string;
  "--border-radius-sm": string;
};

export type TableRowKeyType = string | number;

export type FilterMenuProps = {
  visible: boolean;
  fetchedFilter: Record<string, string[]>;
  updateSelectedFilters(key: string, value?: string | string[]): Promise<ISelectedFilter>;
  updateInputValue:
    | ((key: string, value: string) => Promise<IFilterInputCollection>)
    | ((key: string, value: string) => Promise<void>);
  value: string | undefined;
  columnKey: string;
  currentColumn?: ColumnType<any>;
  onHide?: (visible: boolean) => void;
  selectedFilters?: Set<string>;
  isServerSide?: boolean;
  loading?: boolean;
};

export type PaginationContainerProps = {
  paginationProps: TablePaginationProps;
  updatePaginationProps: (valuesToUpdate: TablePaginationProps, shouldTriggerServerUpdate?: boolean) => void;
  onPaginationChange?: (props: TablePaginationProps) => void;
  progressReporters: Set<DataFetchingType>;
  paginationDefaults?: {
    pageSizes?: Array<number>;
    defaultCurrentPage?: number;
    defaultPageSize?: number;
  };
  settingsMenuProps: Omit<SettingsMenuProps, "visible">;
  changeColumnVisibility: ColumnVisibilityProps | boolean | undefined;
  selectedRows: Set<TableRowKeyType>;
  loading?: boolean | undefined;
};

export type EllipsisProps = {
  columnHead: boolean;
  rowData: boolean;
};

//#region Table constructor
export type TableElementProps = Pick<
  React.HTMLAttributes<HTMLDivElement>,
  "className" | "style" | "children" | "onClick" | "onContextMenu"
>;

export interface TableHeadDataProps extends TableElementProps {
  columnKey: string;
  rowProps?: {
    width?: string | number | undefined;
  };
  draggingProps?: {
    isDraggable?: boolean | undefined;
    draggingActive?: boolean | undefined;
  };
  resizingProps?: {
    onMouseDown: (columnKey: string) => void;
    activeIndex?: string | undefined;
    isResizable?: boolean | undefined;
  };
  toolBoxes?: (JSX.Element | undefined)[];
  alternateFilterInputProps?: {
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
}

export interface TableHeadProps extends TableElementProps {
  items: Array<TableHeadDataProps>;
  setColumnOrder: React.Dispatch<React.SetStateAction<Array<string>>>;
  draggingEnabled?: boolean | undefined;
  onColumnDragged?: (columnKeys: Array<string>) => void;
}

export interface TableBodyProps extends TableElementProps {}

export interface TableRowProps extends TableElementProps {
  expandedProps?: {
    children: React.ReactNode;
    isRowExpanded: boolean;
    showSeperatorLine: boolean;
  };
}

export interface TableRowDataProps extends TableElementProps {
  rowProps?: {
    width?: string | number | undefined;
  };
}
///#endregion
