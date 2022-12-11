import {
  ContextMenu,
  EllipsisProps,
  PaginationContainerProps,
  ISelectedFilter,
  SortDirectionType,
  ISortingFilter,
  TableRowKeyType,
  IAbstractInputCollection,
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
export type TableLocalizationType = {
  dataLoading: string;
  defaultFilterSearchPlaceholder: string;
  alternativeFilterSearchPlaceholder: string;
  filterReset: string;
  filterLoading: string;
  dataEmpty: string;
  filterEmpty: string;
  paginationPageSize: string;
  paginationNext: string;
  paginationPrev: string;
  paginationTotalCount: string;
  filterButtonTitle: string;
  ascendingSortTitle: string;
  descendingSortTitle: string;
  clearSortTitle: string;
  rowExpandTitle: string;
  rowShrinkTitle: string;
  columnVisibilityTitle: string;
  rowsSelectedTitle: string;
  selectOptionsLoading: string;
};

export type TableThemeType = {
  backgroundColor: string;
  primaryColor: string;
  borderRadiusLg: string;
  borderRadiusMd: string;
  borderRadiusSm: string;
};

export type TableDimensionsType = {
  contextMenuColumnWidth: number;
  selectionMenuColumnWidth: number;
  expandedMenuColumnWidth: number;
  defaultColumnWidth: number;
  defaultDataRowHeight: number;
  defaultHeadRowHeight: number;
  minColumnResizeWidth: number;
  maxColumnResizeWidth: number;
};

export type ElementStylingsCollection = {
  filterMenu: ElementStyling;
  tableHead: ElementStyling;
  tableFoot: ElementStyling;
  tableBody: ElementStyling;
  contextMenu: ElementStyling;
};

type ElementStyling = {
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
};

export type ColumnVisibilityProps = {
  /**
   * List of columns to display in the list.
   */
  defaultValues: Array<{ key: string; title: string }>;
  /**
   *  List of column keys that are visible by default.
   */
  defaultVisibleHeaders?: Set<string>;
};

type ResizableColumnProps = {
  /** List of columns to disable resizing feature. */
  columnsToExclude?: Array<string>;
  /**
   * Fires an event when resizing event finishes.
   * @param collection Set of column keys that are retrieved when resizing ends.
   * @returns
   */
  onColumnResize?: (collection: Map<string, number>) => void;
};

type DraggableColumnProps = {
  /** List of columns to disable dragging feature. */
  columnsToExclude?: Array<string> | undefined;
  /**
   * Fires an event when dragging event finishes.
   * @param columKeys Set of column keys that are retrieved when dragging ends.
   * @returns
   */
  onColumnDragged?: (columKeys: Array<string>) => void;
  /**
   * Default order of the columns in a list.
   */
  defaultColumnOrder?: Array<string> | undefined;
};

type ExpandableRowProps<DataType> = {
  /**
   *  Render element when collapse event occurs.
   * @param data Data that is passed for rendering.
   * @returns Element to be displayed.
   */
  render?: (data: DataType) => React.ReactNode;
  /**
   *  Exclude set of rows from being expanded.
   * @param data Data that is passed for rendering.
   * @returns
   */
  excludeWhen?: (data: DataType) => boolean;
  /** Fires an event when expand event occurs. */
  onRowExpanded?: (uniqueId: TableRowKeyType) => void;
  /** Fires an event when shrink event occurs. */
  onRowShrinked?: (uniqueId: TableRowKeyType) => void;
  /** Display seperator line on the left of the row when expanded.
   * @default true
   */
  showSeperatorLine?: boolean | undefined;
};

type ClientPaginationProps = {
  /** Fires an event when either page size or current page changes.  */
  onPaginationChange?: (props: TablePaginationProps) => void;
  /** Defaults for table pagination. */
  defaults?: PaginationContainerProps["paginationDefaults"];
};

type ClientSortingProps<DataType> = {
  /** Fires an event when sorting event occurs. */
  onSortingChange?: (key: string, direction: SortDirectionType, sortedData: DataType[]) => void;
};

export type DefaultFilteringProps = {
  /** Set of default filters to display. Will override automatic filter generation. */
  defaultFilters?: Array<string> | undefined;
  /** Custom rendering of filter values. */
  render?: (text: string) => React.ReactNode;
  /** Allows the ability to execute custom comparison when filter event occurs. */
  equalityComparer?: (selectedFilter: string, valueToCompare: any) => boolean;
  /** Custom prop rendering for the input element in filter search menu. */
  searchInputProps?: (key: string) => React.InputHTMLAttributes<HTMLInputElement>;
  /** Allows the ability to execute custom comparison when search event occurs. */
  searchEqualityComparer?: (inputValue: string, valueToCompare: any) => boolean;
};

export type AlternateFilteringProps = InputAlternateFiltering | SelectAlternateFiltering;

export type InputAlternateFiltering = {
  type?: "input";
  /** Allows the ability to execute custom comparison when search event occurs. */
  equalityComparer?: (inputValue?: string, dataToCompare?: any) => boolean;
  /** Custom prop rendering for the input element in filter search menu. */
  searchInputProps?: (key: string) => React.InputHTMLAttributes<HTMLInputElement>;
  renderCustomInput?: (handleChange: (key: string, value: any | Set<any>) => void, value: any) => React.ReactNode;
};

export type SelectAlternateFiltering<DataType = any> = {
  type?: "select";
  /** Allows the ability to execute custom comparison when search event occurs. */
  equalityComparer?: (inputValue?: DataType, dataToCompare?: DataType) => boolean;
  /** Set of default filters to display. Will override automatic filter generation. */
  defaultFilters?: Array<string> | undefined;
  multipleSelection?: boolean | undefined;
  /** Custom rendering of filter values. */
  render?: (text: string) => React.ReactNode;
};

type ColumnSortingProps<DataType> = {
  /** Allows the ability to implement custom sorting when sorting event occurs. */
  sortingComparer?: (
    first: DataType[keyof DataType],
    second: DataType[keyof DataType],
    alg: SortDirectionType
  ) => number;
};

export type FilterDisplayStrategy = "default" | "alternative";

export type TableReference<DataType> = {
  /**
   * Gets filtered data that is currently displayed.
   * @returns Data collection.
   */
  getCurrentData: () => DataType[] | undefined;
  /**
   * Gets set of columns that are visible.
   * @returns Column collection.
   */
  getCurrentColumns: () => ColumnType<DataType>[];
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
  filteringProps?: {
    default?: DefaultFilteringProps | undefined;
    alternate?: AlternateFilteringProps | undefined;
  };
  /** Enables sorting of data. */
  sort?: boolean | undefined;
  sortingProps?: ColumnSortingProps<DataType> | undefined;
  /** Action to take when overflow of content occurs.
   * @default true
   **/
  ellipsis?: EllipsisProps | boolean | undefined;
};

/** Set of type defintions for `Table` component. */
export type TableProps<DataType> = {
  /** Columns that will be used in the table. */
  readonly columns: ColumnType<DataType>[];
  /** Data to display. Object keys must match column keys if default rendering is used. */
  data: DataType[] | undefined;
  /** Identifier key of the data object. */
  readonly uniqueRowKey: keyof DataType;
  /** Allows the user to hover over the rows. */
  isHoverable?: boolean | undefined;
  /** Allows the usage of checkboxes and row selection. */
  selectionMode?: "default" | "onRowClick" | undefined;
  /** Adjusts column width automatically on intitial render. */
  autoAdjustColWidthOnInitialRender?: boolean | undefined;
  /** Allows the ability to customize localization. */
  localization?: Partial<TableLocalizationType>;
  /** Allows the ability to customize table dimensions. */
  tableDimensions?: Partial<TableDimensionsType>;
  /** Display three-dot context menu at the end of the row.  */
  contextMenu?: {
    render?: (
      data: DataType | undefined,
      selectedRows: Set<TableRowKeyType>,
      paginationProps: TablePaginationProps,
      selectedFilters: ISelectedFilter,
      closeMenu: () => void
    ) => (ContextMenu | undefined)[];
    /** Displays context menu on right click.
     * @default true
     */
    displayOnRightClick?: boolean;
  };
  /** Displays loading-skeleton if activated. */
  loading?: boolean | undefined;
  /** Callback function to execute on row click. */
  onRowClick?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    /** Unique key of the row. */
    rowKey: TableRowKeyType
  ) => void;
  /** Allows the use of either selection or text based filtering. */
  filterDisplayStrategy?: FilterDisplayStrategy | undefined;
  pagination?: ClientPaginationProps | undefined;
  sorting?: ClientSortingProps<DataType> | undefined;
  /** Configurations to allow API based filtering and pagination. */
  serverSide?: {
    pagination?: {
      dataCount: number;
      onChangeAsync: (paginationProps: TablePaginationProps, filters: ISelectedFilter) => Promise<void>;
    };
    defaultFiltering?: {
      /** Fires an event when input field's value is changed.  */
      onFilterSearchAsync?: (key: string, inputValue?: string) => Promise<string[]>;
      /** Fires an event when filter selection is changed. */
      onFilterSelectAsync?: (
        /** Currently selected filters. */
        filters: ISelectedFilter,
        /** Pagination props that are currently active. */
        paginationProps: TablePaginationProps,
        /** Sorting props that are currently active. */
        sortingProps: ISortingFilter | undefined
      ) => Promise<void>;
    };
    alternativeFiltering?: {
      /** Fires an event when input field's value is changed.  */
      onDefaultFilterFetchAsync?: (key: string) => Promise<string[]>;
      /** Fires an event when filter selection is changed. */
      onFilterSearchAsync?: (
        /** Currently selected filters. */
        filters: IAbstractInputCollection,
        /** Pagination props that are currently active. */
        paginationProps: TablePaginationProps,
        /** Sorting props that are currently active. */
        sortingProps: ISortingFilter | undefined
      ) => Promise<void>;
    };
    sorting?: {
      /** Fires an event when sorting occures.  */
      onSortingChangeAsync?: (
        /** Column key. */
        key: string,
        /** Currently selected filters. */
        filters: ISelectedFilter | IAbstractInputCollection,
        /** Pagination props that are currently active. */
        paginationProps: TablePaginationProps,
        /** Current sorting direction of the column. */
        direction: SortDirectionType
      ) => Promise<void>;
    };
  };
  /**
   * Height of the scrollable body of table.
   * @default "100%"
   */
  tableHeight?: string | number | undefined;
  /** Allows the ability to use custom table styling. */
  themeProperties?: Partial<TableThemeType> | undefined;
  /** Class or style based element styling.  */
  elementStylings?: Partial<ElementStylingsCollection> | undefined;
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
  /** Reference to table element to provide data and column access tools. */
  tableRef?: React.MutableRefObject<TableReference<DataType> | null>;
  /** Allows the table rows to contain striped background color.  */
  striped?: boolean | undefined;
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
};
