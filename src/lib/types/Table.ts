import {
  ContextMenu,
  EllipsisProps,
  PaginationContainerProps,
  ISelectedFilter,
  SortDirectionType,
  ISortingFilter,
  TableRowKeyType,
  IFilterInputCollection,
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
  defaultValues: Array<{ key: string; title: string }>;
  defaultVisibleHeaders?: Set<string>;
};

type ResizableColumnProps = {
  columnsToExclude?: Array<string>;
  onColumnResize?: (collection: Map<string, number>) => void;
};

type DraggableColumnProps = {
  columnsToExclude?: Array<string> | undefined;
  onColumnDragged?: (columKeys: Array<string>) => void;
  defaultColumnOrder?: Array<string> | undefined;
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
  defaults?: PaginationContainerProps["paginationDefaults"];
};

type ClientSortingProps<DataType> = {
  onSortingChange?: (key: string, direction: SortDirectionType, sortedData: DataType[]) => void;
};

export type DefaultFilteringProps = {
  /** Set of default filters to display. Will override automatic filter generation. */
  defaultFilters?: Array<string> | undefined;
  /** Custom rendering of filter values. */
  render?: (text: string) => React.ReactNode;
  /** Custom prop rendering for the input element in filter search menu. */
  equalityComparer?: (selectedFilter: string, valueToCompare: any) => boolean;
  searchInputProps?: (key: string) => React.InputHTMLAttributes<HTMLInputElement>;
  searchEqualityComparer?: (inputValue: string, valueToCompare: any) => boolean;
};

export type AlternateFilteringProps = {
  /** Custom prop rendering for the input element in column search field. */
  equalityComparer?: (inputValue?: string, dataToCompare?: any) => boolean;
};

type ColumnSortingProps<DataType> = {
  sortingComparer?: (
    first: DataType[keyof DataType],
    second: DataType[keyof DataType],
    alg: SortDirectionType
  ) => number;
};

export type FilterDisplayStrategy = "default" | "alternative";

export type TableReference<DataType> = {
  getCurrentData: () => DataType[] | undefined;
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
  data?: DataType[];
  /** Identifier key of the data object. */
  readonly uniqueRowKey: keyof DataType;
  /** Allows the user to hover over the rows. */
  isHoverable?: boolean | undefined;
  /** Allows the usage of checkboxes and row selection. */
  selectionMode?: "default" | "onRowClick" | undefined;
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
        filters: ISelectedFilter,
        paginationProps: TablePaginationProps,
        sortingProps: ISortingFilter | undefined
      ) => Promise<void>;
    };
    alternativeFiltering?: {
      /** Fires an event when filter selection is changed. */
      onFilterSearchAsync?: (
        filters: IFilterInputCollection,
        paginationProps: TablePaginationProps,
        sortingProps: ISortingFilter | undefined
      ) => Promise<void>;
    };
    sorting?: {
      /** Fires an event when sorting occures.  */
      onSortingChangeAsync?: (
        key: string,
        filters: ISelectedFilter | IFilterInputCollection,
        paginationProps: TablePaginationProps,
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
  tableRef?: React.MutableRefObject<TableReference<DataType> | null>;
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
};
