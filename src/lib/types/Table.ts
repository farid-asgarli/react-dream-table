import {
  ContextMenu,
  EllipsisProps,
  PaginationTableProps,
  SelectedFilterType,
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

export type ColumnType<DataType> = {
  /** Unique identifier key of column. Using `key` allows data object to be indexed on per-key basis. */
  key: string;
  /** Width of column either in `px` or `%`. */
  width?: number | undefined;
  /** Title to render on column head, `th`. */
  title?: string | undefined;
  /** Custom rendering of data. */
  dataRender?: (entity: DataType) => React.ReactNode;
  /** Custom rendering of filter values. */
  filterRender?: (text: string) => React.ReactNode;
  /** Custom rendering of data when the value is either undefined or null. */
  dataRenderOnNullOrUndefined?: (entity: DataType) => React.ReactNode;
  /** Custom rendering of table heads `th`. */
  columnRender?: () => React.ReactNode;
  /** Enables filtering of data. `true` for default filtering,  `function` for customized display of filters. */
  filter?: boolean | ((filter: string) => string);
  /** Set of default filters to display. Will override automatic filter generation. */
  defaultFilters?: Array<string> | undefined;
  /** Action to take when overflow of content occurs.
   * @default true
   **/
  ellipsis?: EllipsisProps | boolean | undefined;
  /** Custom prop rendering for the input element in filter search menu. */
  filterSearchInputProps?: (
    key: string
  ) => React.InputHTMLAttributes<HTMLInputElement>;
  filterEqualityComparer?: (
    selectedFilter: string,
    valueToCompare: any
  ) => boolean;
  filterSearchEqualityComparer?: (
    inputValue: string,
    valueToCompare: any
  ) => boolean;
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
  // /** Allows the user to click and activate a row. */
  // isRowClickable?: boolean | undefined;
  /** Allows the usage of checkboxes and row selection. */
  selectionMode?: "multiple";
  /** Allows the ability to use custom localization. */
  localization?: (
    currentLocalization: ContextLocalization
  ) => ContextLocalization;
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
  /** Fires an event when either page size or current page changes.  */
  onPaginationChange?: (props: TablePaginationProps) => void;
  /** Defaults for table pagination. */
  paginationDefaults?: PaginationTableProps["paginationDefaults"];
  /** Configurations to allow API based filtering and pagination. */
  serverSide?: {
    pagination?: {
      dataCount: number;
      onChange: (
        paginationProps: TablePaginationProps,
        filters: SelectedFilterType
      ) => Promise<void>;
    };
    filters?: {
      /** Fires an event when input field's value is changed.  */
      onFilterSearch?: (key: string, inputValue?: string) => Promise<string[]>;
      /** Fires an event when filter selection is changed. */
      onFilterSelect?: (
        filters: SelectedFilterType,
        paginationProps: TablePaginationProps
      ) => Promise<void>;
    };
  };
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
  resizableColumns?: ResizableColumnProps | boolean;
  draggableColumns?: DraggableColumnProps | boolean;
  // pinnedColumns?: {
  //   left?: Array<string>;
  //   right?: Array<string>;
  // };
};
