import React, { HTMLAttributes } from "react";
import { ColumnType, ColumnVisibilityProps, TablePaginationProps } from "./Table";

export type ContextMenu = {
  content: React.ReactNode;
  key: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export type SettingsMenuProps = HTMLAttributes<HTMLDivElement> & {
  visibleColumnKeys: Set<string>;
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

export type SelectedFilterType = {
  [key: string]: Set<string>;
};

export type FetchedFilterType = Map<string, string[]>;

export type SortFilterType = {
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
  fetchedFilter: Map<string, string[]>;
  updateSelectedFilters(key?: string | undefined, value?: string | string[] | undefined): Promise<void>;
  updateInputValue: (key?: string | undefined, value?: string | undefined) => Promise<void>;
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
  fetching: Set<DataFetchingType>;
  paginationDefaults?: {
    pageSizes?: Array<number>;
    defaultCurrentPage?: number;
    defaultPageSize?: number;
  };
  settingsMenuProps: Omit<SettingsMenuProps, "visible">;
  changeColumnVisibility: ColumnVisibilityProps | boolean | undefined;
};

export type EllipsisProps = {
  columnHead: boolean;
  rowData: boolean;
};

//#region Table constructor
export type TableElementProps = Pick<React.HTMLAttributes<HTMLDivElement>, "className" | "style" | "children" | "onClick">;

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
    handleChangeFilterInput?: (key: string, value: string) => void;
    currentValue?: string;
  };
}

export interface TableHeadProps extends TableElementProps {
  items: Array<TableHeadDataProps>;
  setColumnOrder: React.Dispatch<React.SetStateAction<Array<string>>>;
  draggingEnabled?: boolean | undefined;
  onColumnDragged?: (columnKeys: Array<string>) => void;
}

export interface TableBodyProps extends TableElementProps {
  loadingVisible: boolean;
}

export interface TableRowProps extends TableElementProps {
  expandedProps?: {
    children: React.ReactNode;
    isRowExpanded: boolean;
  };
}

export interface TableRowDataProps extends TableElementProps {
  rowProps?: {
    width?: string | number | undefined;
  };
}
///#endregion
