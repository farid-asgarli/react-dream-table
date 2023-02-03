import { Dayjs } from "dayjs";
import { DefaultDataGridIcons } from "../static/icons";
import {
  ActionsMenuListItem,
  BaseFilterFnDefinition,
  CompleteFilterFnDefinition,
  FooterProps,
  ICurrentFilterCollection,
  ICurrentSorting,
  SortDirectionDefinition,
  DataGridRowKeyDefinition,
  ICurrentFnCollection,
} from "./Utils";

export type KeyLiteralType<DataType> = keyof DataType | (string & {});

export type CommonDataType = Record<string, any>;

export interface InputDateFiltering {
  type?: "date";
  /** Assign datepicker localization. */
  pickerLocale?: "en" | "az";
  /**
   * @default "equals"
   */
  defaultFilterFn?: BaseFilterFnDefinition;
  /** Allows the ability to execute custom comparison when search event occurs. */
  equalityComparer?: (filterValue?: Dayjs, data?: any, filterFn?: BaseFilterFnDefinition) => boolean;
}

export interface InputCommonFiltering {
  type?: "text" | "number";
  /**
   * @default "contains"
   */
  defaultFilterFn?: CompleteFilterFnDefinition;
  /** Allows the ability to execute custom comparison when search event occurs. */
  equalityComparer?: (filterValue?: string, data?: any, filterFn?: CompleteFilterFnDefinition) => boolean;
}

export type InputFiltering = (InputDateFiltering | InputCommonFiltering) & {
  /** Enables filtering functions menu.
   * @default true
   */
  enableFilterFns?: boolean | undefined;
  /** Custom prop rendering for the input element in filter search menu. */
  inputProps?: (key: string) => React.InputHTMLAttributes<HTMLInputElement>;
  renderCustomInput?: (
    handleChange: (key: string, value: any | Array<any>) => void,
    value: any,
    rangeIndex: number | undefined
  ) => React.ReactNode;
};

export interface SelectFiltering<DataType = any> {
  type?: "select";
  /** Allows the ability to execute custom comparison when search event occurs. */
  equalityComparer?: (filterValue?: DataType, data?: DataType) => boolean;
  /** Set of default filters to display. Will override automatic filter generation. */
  defaultFilters?: Array<string> | undefined;
  /** Allows the ability to choose multiple options. */
  multipleSelection?: boolean | undefined;
  /** Custom rendering of filter values. */
  render?: (text: string) => React.ReactNode;
}
export type DataGridFilteringProps = InputFiltering | SelectFiltering;

export interface DataGridLocalizationDefinition {
  dataLoading: string;
  filterInputPlaceholder: string;
  filterDatePlaceholder: string;
  filterLoading: string;
  clearFilers: string;
  dataEmpty: string;
  noResult: string;
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
  settingsMenuTitle: string;
  rowsSelectedTitle: string;
  selectOptionsLoading: string;
  selectPlaceholder: string;
  menuTitle: string;
  hideColumn: string;
  pinColumnToLeft: string;
  pinColumnToRight: string;
  unpinColumn: string;
  filterContains: string;
  filterStartsWith: string;
  filterEndsWith: string;
  filterEquals: string;
  filterFuzzy: string;
  filterNotEquals: string;
  filterBetween: string;
  filterBetweenInclusive: string;
  filterGreaterThan: string;
  filterGreaterThanOrEqualTo: string;
  filterLessThan: string;
  filterLessThanOrEqualTo: string;
  filterEmpty: string;
  filterNotEmpty: string;
  fullScreenToggle: string;
}

export interface DataGridThemeDefinition {
  boxShadow: string;
  primaryColor: string;
  borderRadiusLg: string;
  borderRadiusMd: string;
  borderRadiusSm: string;
}

export interface DataGridDimensionsDefinition {
  actionsMenuColumnWidth: number;
  selectionMenuColumnWidth: number;
  expandedMenuColumnWidth: number;
  defaultColumnWidth: number;
  defaultDataRowHeight: number;
  defaultHeadRowHeight: number;
  defaultExpandPanelHeight: number;
  minColumnResizeWidth: number;
  maxColumnResizeWidth: number;
  defaultHeaderFilterHeight: number;
  defaultFooterHeight: number;
  defaultScrollbarWidth: number;
}

export type DataGridIconsDefinition = typeof DefaultDataGridIcons;

interface ClientPaginationProps<DataType> {
  /** Fires an event when either page size or current page changes.  */
  onPaginationChange?: (props: DataGridPaginationProps) => void;
  /** Defaults for data-grid pagination. */
  defaults?: FooterProps<DataType>["paginationDefaults"];
}

interface ClientSortingProps<DataType> {
  /** Fires an event when sorting event occurs. */
  onSortingChange?: (key: KeyLiteralType<DataType>, direction: SortDirectionDefinition, sortedData: DataType[]) => void;
}

export interface EllipsisProps {
  columnHead: boolean;
  rowData: boolean;
}

interface ColumnSortingProps {
  /** Allows the ability to implement custom sorting when sorting event occurs. */
  sortingComparer?: (first: any, second: any, alg: SortDirectionDefinition) => number | undefined;
}

export interface ColumnDefinition<DataType> {
  /** Unique id of column. */
  key: KeyLiteralType<DataType>;
  /** Width of the column, in number. */
  width?: number | undefined;
  /** Title to render on column head, `th`. */
  title?: string | undefined;
  /** Custom rendering of data. */
  dataRender?: (entity: DataType) => React.ReactNode;
  /** Custom rendering of data-grid heads `th`. */
  headerRender?: () => React.ReactNode;
  /** Enables filtering of data. */
  filter?: boolean | undefined;
  filteringProps?: DataGridFilteringProps | undefined;
  /** Enables sorting of data. */
  sort?: boolean | undefined;
  sortingProps?: ColumnSortingProps | undefined;
  /** Alignment of data-grid head. */
  headerAlignment?: "left" | "middle" | "right" | undefined;
  /** Alignment of data-grid row data cell. */
  cellAlignment?: "left" | "middle" | "right" | undefined;
}

export interface CommonInteractiveProps {
  active?: boolean | undefined;
}

type ColumnPinCollection<DataType> = Array<"select" | "actions" | "expand" | keyof DataType | (string & {})>;
export type ColumnPinProps<DataType> = CommonInteractiveProps & {
  /**
   * An array of column keys to pin.
   * - "actions" - The key to pin actions menu.
   * - "select" - The key to pin select menu.
   * - "expand" - The key to pin expand menu.
   */
  left?: ColumnPinCollection<DataType>;
  /**
   * An array of column keys to pin.
   * - "actions" - The key to pin actions menu.
   * - "select" - The key to pin select menu.
   * - "expand" - The key to pin expand menu.
   */
  right?: ColumnPinCollection<DataType>;
  /**
   * Fires an event when column pinning occurs.
   */
  onColumnPin?: (pinnedColumns: { left: ColumnPinCollection<DataType>; right: ColumnPinCollection<DataType> }) => void;
};
export interface ColumnResizingProps<DataType> extends CommonInteractiveProps {
  /** List of columns to disable resizing feature. */
  columnsToExclude?: Array<KeyLiteralType<DataType>>;
  /**
   * Fires an event when resizing event finishes.
   * @param collection Set of column keys that are retrieved when resizing ends.
   * @returns
   */
  onColumnResize?: (collection: Record<KeyLiteralType<DataType>, number>) => void;
}

export interface DataGridTooltipProps extends CommonInteractiveProps {
  type?: "native" | "styled" | undefined;
}

export interface ColumnVisibilityProps<DataType> extends CommonInteractiveProps {
  /**
   * List of columns to display in the list.
   */
  defaultValues?: Array<{ key: KeyLiteralType<DataType>; title: string }>;
  /**
   *  List of column keys that are visible by default.
   */
  defaultVisibleHeaders?: Array<KeyLiteralType<DataType>>;
  /**
   * Fires an event when visibility event finishes.
   * @param collection Collection of column keys that are retrieved when visibility event occurs.
   * @returns
   */
  onVisibilityChange?: (collection: Array<KeyLiteralType<DataType>>) => void;
}
export interface ColumnDraggingProps<DataType> extends CommonInteractiveProps {
  /** List of columns to disable dragging feature. */
  columnsToExclude?: Array<KeyLiteralType<DataType>> | undefined;
  /**
   * Fires an event when dragging event finishes.
   * @param columKeys Set of column keys that are retrieved when dragging ends.
   * @returns
   */
  onColumnDragged?: (columKeys: Array<KeyLiteralType<DataType>>) => void;
  /**
   * Default order of the columns in a list.
   */
  defaultColumnOrder?: Array<KeyLiteralType<DataType>> | undefined;
}
export interface RowSelectionProps extends CommonInteractiveProps {
  type?: "onRowClick" | "default" | undefined;
}
export interface RowActionsMenuProps<DataType> extends CommonInteractiveProps {
  onOpen?: (data: DataType) => void;
  onHide?: () => void;
  render?: (
    data: DataType | undefined,
    selectedRows: Set<DataGridRowKeyDefinition>,
    paginationProps: DataGridPaginationProps,
    closeMenu: () => void
  ) => (ActionsMenuListItem | undefined)[];
  /** Displays context menu on right click.
   * @default true
   */
  displayOnRightClick?: boolean;
}

export interface FilterFnsMenuProps extends CommonInteractiveProps {}

export interface HeaderActionsMenuProps extends CommonInteractiveProps {}

export interface RowExpandabilityProps<DataType> extends CommonInteractiveProps {
  /**
   *  Render element when collapse event occurs.
   * @param data Data that is passed for rendering.
   * @returns Element to be displayed.
   */
  render?: (data: DataType, displayWidth: number) => React.ReactNode;
  /**
   *  Exclude set of rows from being expanded.
   * @param data Data that is passed for rendering.
   * @returns
   */
  excludeWhen?: (data: DataType) => boolean;
  /** Fires an event when expand event occurs. */
  onRowExpanded?: (uniqueId: DataGridRowKeyDefinition) => void;
  /** Fires an event when shrink event occurs. */
  onRowShrinked?: (uniqueId: DataGridRowKeyDefinition) => void;
  /** Display seperator line on the left of the row when expanded.
   * @default true
   */
  showSeparatorLine?: boolean | undefined;
}

export interface VirtualizationProps extends CommonInteractiveProps {
  /**
   * @default 6
   * Amount of rows to render ahead of scroll event. */
  preRenderedRowCount?: number | undefined;
}

export interface DataGridReference<DataType> {
  /**
   * Gets filtered data that is currently displayed.
   * @returns Data collection.
   */
  getCurrentData: () => DataType[] | undefined;
  /**
   * Gets set of columns that are visible.
   * @returns Column collection.
   */
  getCurrentColumns: () => ColumnDefinition<DataType>[];
  /**
   * Gets collection of filters that are currently active.
   * @returns Filter collection.
   */
  getCurrentFilters: () => ICurrentFilterCollection;
  /**
   * Resets collection of filters that are currently active.
   */
  resetCurrentFilters: () => void;
}

export interface DataGridProps<DataType> {
  /** Data to display. Object keys must match column keys if default rendering is used. */
  data: DataType[] | undefined;
  /** Display three-dot context menu at the end of the row. */
  rowActionsMenu?: RowActionsMenuProps<DataType> | undefined;
  /** Display three-dot context menu at the end of head cell. */
  headerActionsMenu?: HeaderActionsMenuProps | undefined;
  /** Display filter functions menu next to inputs. */
  filterFnsMenu?: FilterFnsMenuProps | undefined;
  /** Columns that will be used in the data-grid. */
  columns: ColumnDefinition<DataType>[];
  /** Displays loading-skeleton if activated. */
  loading?: boolean | undefined;
  /** Allows the ability to resize the columns. */
  resizableColumns?: ColumnResizingProps<DataType> | undefined;
  /** Allows the ability to drag columns and change their order. */
  draggableColumns?: ColumnDraggingProps<DataType> | undefined;
  /** Allows the ability for a row to expand. */
  expandableRows?: RowExpandabilityProps<DataType> | undefined;
  /**
   * Enables full screen toggle in footer.
   * @default true */
  fullScreenToggle?: boolean | undefined;
  /** Allows the ability to alter column visibility. */
  columnVisibilityOptions?: ColumnVisibilityProps<DataType> | undefined;
  /** Allows the ability to display tooltip on cells. */
  tooltipOptions?: DataGridTooltipProps | undefined;
  /** Identifier key of the data object. */
  uniqueRowKey: KeyLiteralType<DataType>;
  /** Allows the usage of checkboxes and row selection. */
  selectableRows?: RowSelectionProps | undefined;
  /** Allows the usage of pinning columns to either left or right. */
  pinnedColumns?: ColumnPinProps<DataType> | undefined;
  /** Adds border around data cells. */
  borderedCell?: boolean | undefined;
  /** Allows the user to hover over the rows. */
  isHoverable?: boolean | undefined;
  /** Adjusts column width automatically on intitial render. */
  autoAdjustColWidthOnInitialRender?: boolean | undefined;
  pagination?: ClientPaginationProps<DataType> | undefined;
  sorting?: ClientSortingProps<DataType> | undefined;
  /** Allows the ability to customize icons. */
  icons?: Partial<DataGridIconsDefinition> | undefined;
  /** Allows the ability to customize localization. */
  localization?: Partial<DataGridLocalizationDefinition> | undefined;
  /** Allows the ability to customize data-grid dimensions. */
  dimensions?: Partial<DataGridDimensionsDefinition>;
  /** Allows the ability to use custom data-grid styling. */
  theming?: Partial<DataGridThemeDefinition> | undefined;
  /** Reference to data-grid element to provide data and column access tableTools. */
  dataGridApiRef?: React.MutableRefObject<DataGridReference<DataType> | null>;
  /** Allows the data-grid rows to contain striped background color.  */
  striped?: boolean | undefined;
  /** Improves both rendering and overall performance of the list. */
  virtualization?: VirtualizationProps | undefined;
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
  /** Callback function to execute on row click. */
  onRowClick?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    /** Data of the data-grid row. */
    data: DataType
  ) => void;
  /** Configurations to allow API based filtering and pagination. */
  serverSide?: {
    pagination?: {
      dataCount?: number | undefined;
      onChangeAsync: (paginationProps: DataGridPaginationProps, filters: ICurrentFilterCollection) => Promise<void>;
    };
    filtering: {
      /** Fires an event when input field's value is changed.
       * Required when select options are fetched server-side.  */
      onDefaultFilterFetchAsync?: (key: KeyLiteralType<DataType>) => Promise<string[]>;
      /** Fires an event when filtering updates. */
      onFilterChangeAsync?: (
        /** Currently selected filters. */
        filters: ICurrentFilterCollection,
        /** Pagination props that are currently active. */
        paginationProps: DataGridPaginationProps,
        /** Sorting props that are currently active. */
        sortingProps: ICurrentSorting | undefined
      ) => Promise<void>;
      onFilterFunctionChangeAsync?: (
        /** Currently active filter functions. */
        filterFns: ICurrentFnCollection,
        /** Currently selected filters. */
        filters: ICurrentFilterCollection,
        /** Pagination props that are currently active. */
        paginationProps: DataGridPaginationProps,
        /** Sorting props that are currently active. */
        sortingProps: ICurrentSorting | undefined
      ) => Promise<void>;
    };
    sorting?: {
      /** Fires an event when sorting occures.  */
      onSortingChangeAsync?: (
        /** Column key. */
        key: KeyLiteralType<DataType>,
        /** Currently selected filters. */
        filters: ICurrentFilterCollection,
        /** Pagination props that are currently active. */
        paginationProps: DataGridPaginationProps,
        /** Current sorting direction of the column. */
        direction: SortDirectionDefinition
      ) => Promise<void>;
    };
  };
}

export interface DataGridPaginationProps {
  /** Current page size to display. */
  pageSize?: number;
  /** Current page of data-grid. */
  currentPage?: number;
  /** Total size of data elements. */
  dataCount?: number;
}
