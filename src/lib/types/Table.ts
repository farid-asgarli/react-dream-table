import {
  ContextMenu,
  EllipsisProps,
  PaginationTableProps,
  SelectedFilterType,
  SortDirectionType,
  TableRowKeyType,
} from "./Utils";

export type TablePaginationProps = {
  /** Current page size to display. */
  pageSize?: number;
  /** Current page of table. */
  currentPage?: number;
  /** Total size of data elements. */
  dataCount?: number;
};

export type ColumnVisibilityProps = {
  defaultValues: Array<{ key: string; title: string }>;
};

/**
 * Allows the ability to use custom localization.
 */
export type ContextLocalization = {
  dataLoading: string;
  filterSearchPlaceholder: string;
  filterReset: string;
  filterLoading: string;
  dataEmpty: string;
  filterEmpty: string;
  paginationPageSize: string;
  paginationNext: string;
  paginationPrev: string;
  paginationTotalCount: string;
};

export type TableTheme = {
  backgroundColor: string;
  primaryColor: string;
};

type ElementStyling = {
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
};

type ResizableColumnProps = {
  minColumnResizeWidth?: number | undefined;
  maxColumnResizeWidth?: number | undefined;
  columnsToExclude?: Array<string>;
};

type DraggableColumnProps = {
  columnsToExclude?: Array<string>;
};

type ExpandableRowProps<DataType> = {
  render?: (data: DataType) => React.ReactNode;
  excludeWhen?: (data: DataType) => boolean;
  onRowExpanded?: (uniqueId: TableRowKeyType) => void;
  onRowShrinked?: (uniqueId: TableRowKeyType) => void;
};

type ClientPaginationProps = {
  /** Fires an event when either page size or current page changes.  */
  onPaginationChange?: (props: TablePaginationProps) => void;
  /** Defaults for table pagination. */
  defaults?: PaginationTableProps["paginationDefaults"];
};

type ClientSortingProps<DataType> = {
  onSortingChange?: (key: string, direction: SortDirectionType, sortedData: DataType[]) => void;
};

type ColumnFilteringProps = {
  /** Set of default filters to display. Will override automatic filter generation. */
  defaultFilters?: Array<string> | undefined;
  /** Custom rendering of filter values. */
  render?: (text: string) => React.ReactNode;
  /** Custom prop rendering for the input element in filter search menu. */
  equalityComparer?: (selectedFilter: string, valueToCompare: any) => boolean;
  searchInputProps?: (key: string) => React.InputHTMLAttributes<HTMLInputElement>;
  searchEqualityComparer?: (inputValue: string, valueToCompare: any) => boolean;
};

type ColumnSortingProps<DataType> = {
  sortingComparer?: (
    first: DataType[keyof DataType],
    second: DataType[keyof DataType],
    alg: SortDirectionType
  ) => number;
};

export type ColumnType<DataType> = {
  /** Unique identifier key of column. Using `key` allows data object to be indexed on per-key basis. */
  key: string;
  /** Width of column either in `px` or `%`. */
  width?: number | undefined;
  /** Title to render on column head, `th`. */
  title?: string | undefined;
  /** Custom rendering of data. */
  dataRender?: (entity: DataType) => React.ReactNode;
  /** Custom rendering of data when the value is either undefined or null. */
  dataRenderOnNullOrUndefined?: (entity: DataType) => React.ReactNode;
  /** Custom rendering of table heads `th`. */
  columnRender?: () => React.ReactNode;
  /** Enables filtering of data. */
  filter?: boolean | undefined;
  filteringProps?: ColumnFilteringProps;
  /** Action to take when overflow of content occurs.
   * @default true
   **/
  sort?: boolean;
  sortingProps?: ColumnSortingProps<DataType> | undefined;
  ellipsis?: EllipsisProps | boolean | undefined;
};

/** Set of type defintions for `Table` component. */
export type TableProps<DataType> = {
  /** Columns that will be used in the table. */
  readonly columns: ColumnType<DataType>[];
  /** Data to display. Object keys must match column keys if default rendering is used. */
  data?: DataType[];
  /** Identifier key of the data object. */
  readonly uniqueRowKey: keyof DataType;
  /** Allows the user to hover over the rows. */
  isHoverable?: boolean | undefined;
  /** Allows the usage of checkboxes and row selection. */
  selectionMode?: "multiple";
  /** Allows the ability to use custom localization. */
  localization?: (currentLocalization: ContextLocalization) => ContextLocalization;
  /** Display three-dot context menu at the end of the row.  */
  renderContextMenu?: (
    data: DataType | undefined,
    selectedRows: Set<TableRowKeyType>,
    paginationProps: TablePaginationProps,
    selectedFilters: SelectedFilterType
  ) => (ContextMenu | undefined)[];
  /** Displays loading-skeleton if activated. */
  loading?: boolean;
  /** Callback function to execute on row click. */
  onRowClick?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    /** Unique key of the row. */
    rowKey: TableRowKeyType
  ) => void;
  pagination?: ClientPaginationProps | undefined;
  sorting?: ClientSortingProps<DataType> | undefined;
  /** Configurations to allow API based filtering and pagination. */
  serverSide?: {
    pagination?: {
      dataCount: number;
      onChangeAsync: (paginationProps: TablePaginationProps, filters: SelectedFilterType) => Promise<void>;
    };
    filters?: {
      /** Fires an event when input field's value is changed.  */
      onFilterSearchAsync?: (key: string, inputValue?: string) => Promise<string[]>;
      /** Fires an event when filter selection is changed. */
      onFilterSelectAsync?: (filters: SelectedFilterType, paginationProps: TablePaginationProps) => Promise<void>;
    };
    sorting?: {
      /** Fires an event when sorting occures.  */
      onSortingChangeAsync?: (key: string, direction: SortDirectionType) => Promise<void>;
    };
  };
  /**
   * Height of the scrollable body of table.
   * @default "100%"
   */
  tableHeight?: string | number | undefined;
  /** Allows the ability to use custom table styling. */
  themeProperties?: TableTheme;
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
  /** Class or style based element styling.  */
  elementStylings?: {
    filterMenu?: ElementStyling;
    tableHead?: ElementStyling;
    tableFoot?: ElementStyling;
    tableBody?: ElementStyling;
    contextMenu?: ElementStyling;
  };
  /** Allows the ability to resize the columns.
   * @default false
   */
  resizableColumns?: ResizableColumnProps | boolean | undefined;
  /** Allows the ability to drag columns and change their order. */
  draggableColumns?: DraggableColumnProps | boolean | undefined;
  /** Allows the ability for a row to expand. */
  expandableRows?: ExpandableRowProps<DataType> | undefined;
  /** Allows the ability to alter column visibility. */
  changeColumnVisibility?: ColumnVisibilityProps | boolean | undefined;
};
// pinnedColumns?: {
//   left?: Array<string>;
//   right?: Array<string>;
// };
