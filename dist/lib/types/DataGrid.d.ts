/// <reference types="react" />
import { Dayjs } from "dayjs";
import { DefaultDataGridIcons } from "../static/icons";
import { ActionsMenuListItem, BaseFilterFnDefinition, CompleteFilterFnDefinition, ICurrentFilterCollection, ICurrentSorting, SortDirectionDefinition, DataGridRowKeyDefinition, ICurrentFnCollection, GridDataType, DefaultDataGridLocale } from "./Utils";
export type KeyLiteralType<DataType extends GridDataType> = keyof DataType | (string & {});
export interface InputDateFiltering {
    /** Value type of default inputs. */
    type?: "date";
    /**
     * @default "equals"
     */
    defaultFilterFn?: BaseFilterFnDefinition;
    /** Set of default filter functions to display in fns menu. */
    defaultFilterFnOptions?: BaseFilterFnDefinition[] | undefined;
    /** Allows the ability to execute custom comparison when search event occurs. */
    equalityComparer?: (filterValue?: Dayjs, data?: any, filterFn?: BaseFilterFnDefinition) => boolean;
}
export interface InputCommonFiltering {
    /** Value type of default inputs. */
    type?: "text" | "number";
    /**
     * @default "contains"
     */
    defaultFilterFn?: CompleteFilterFnDefinition;
    /** Set of default filter functions to display in fns menu. */
    defaultFilterFnOptions?: CompleteFilterFnDefinition[] | undefined;
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
    /** Render custom input element instead of default one. */
    renderCustomInput?: (
    /** Event to handle input change, mainly to update internal filter values. */
    handleChange: (key: string, value: any | Array<any>) => void, 
    /** Filter value to either pass or display in custom input. */
    value: any, 
    /**
     * Provides filter value indexes as `0` and `1` to index value array, in case range filter function is selected.
     * Required only if filter functions are enabled. */
    rangeIndex: number | undefined) => React.ReactNode;
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
    rowShrinkAllTitle: string;
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
    filterFunctions: string;
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
    darkModeToggle: string;
    filterMenuVisibilityToggle: string;
    columnVisibilityOptions: string;
    aboutTitle: string;
    goBackTitle: string;
    groupedColumnToggle: string;
}
export interface DataGridStylingDefinition {
    boxShadow: string;
    primaryColor: string;
    borderRadiusLg: string;
    borderRadiusMd: string;
    borderRadiusSm: string;
}
export interface DataGridDimensionsDefinition {
    /** Default width of row actions menu column.  */
    actionsMenuColumnWidth: number;
    /** Default width of row selection column.  */
    selectionMenuColumnWidth: number;
    /** Default width of expand column.  */
    expandedMenuColumnWidth: number;
    /** Default width of both data and header column.  */
    defaultColumnWidth: number;
    /** Default height of grouped column height.  */
    defaultGroupedColumnHeight: number;
    /** Default height of data row height.  */
    defaultDataRowHeight: number;
    /** Default height of head row height.  */
    defaultHeadRowHeight: number;
    /** Default height of expand menu.
     * Used only if virtualization enabled and `dynamicHeight` options is enabled.  */
    defaultExpandPanelHeight: number;
    /** Minimum width a column can be sized to.  */
    minColumnResizeWidth: number;
    /** Maximum width a column can be sized to.  */
    maxColumnResizeWidth: number;
    /** Default height of filter row.  */
    defaultHeaderFilterHeight: number;
    /** Default height of grid footer.  */
    defaultFooterHeight: number;
    /** Default width of scrollbar of grid body. */
    defaultScrollbarWidth: number;
    /** Additional width to append to the total width of columns. */
    columnOffsetWidth: number;
}
export type DataGridIconsDefinition = typeof DefaultDataGridIcons;
export type LocalizationProps = {
    /**
     * Default localization type to set.
     * @default "en" */
    defaultLocale?: DefaultDataGridLocale;
    /** Custom localization entries.
     * Overrides the default localization values.
     */
    customLocaleProps?: Partial<DataGridLocalizationDefinition> | undefined;
};
interface ClientPaginationProps {
    /** Fires an event when either page size or current page changes.  */
    onPaginationChange?: (props: DataGridPaginationProps) => void;
    /** Defaults for data-grid pagination. */
    defaults?: {
        /** Collection of page sizes.
         * @example [0,10,20]
         */
        pageSizes?: Array<number>;
        /** Default starting page of grid.
         * @default 1
         */
        defaultCurrentPage?: number;
        /** Default starting page size of grid.
         * @default 10
         */
        defaultPageSize?: number;
    };
}
interface ClientSortingProps {
    /** Fires an event when sorting event occurs. */
    onSortingChange?: (sorting: ICurrentSorting | undefined) => void;
}
export interface CellBorderingProps {
    enableHorizontalBorder?: boolean | undefined;
    enableVerticalBorder?: boolean | undefined;
}
interface ColumnSortingProps {
    /** Allows the ability to implement custom sorting when sorting event occurs. */
    sortingComparer?: (first: any, second: any, alg: SortDirectionDefinition) => number;
}
export interface ColumnDefinition<DataType extends GridDataType> {
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
    /** Enables additional customization of filtering process. */
    filteringProps?: DataGridFilteringProps | undefined;
    /** Enables sorting of data. */
    sort?: boolean | undefined;
    /** Enables additional customization of sorting process. */
    sortingProps?: ColumnSortingProps | undefined;
    /** Alignment of data-grid head. */
    headerAlignment?: "left" | "middle" | "right" | undefined;
    /** Alignment of data-grid row data cell. */
    cellAlignment?: "left" | "middle" | "right" | undefined;
}
export interface CommonInteractiveProps {
    enabled?: boolean | undefined;
}
/**
 * An array of column keys to pin.
 * - "actions" - The key to pin actions menu.
 * - "select" - The key to pin select menu.
 * - "expand" - The key to pin expand menu.
 */
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
    onColumnPin?: (pinnedColumns: {
        left: ColumnPinCollection<DataType>;
        right: ColumnPinCollection<DataType>;
    }) => void;
};
export interface ColumnResizingProps<DataType extends GridDataType> extends CommonInteractiveProps {
    /** List of columns to disable resizing feature. */
    columnsToExclude?: Array<KeyLiteralType<DataType>>;
    /**
     * Fires an event when resizing event finishes.
     * @param collection Set of column keys that are retrieved when resizing ends.
     * @returns
     */
    onColumnResize?: (collection: Record<KeyLiteralType<DataType>, number>) => void;
}
export interface AutoColWidthProps {
    adjustOnInitialRender?: boolean | undefined;
    adjustOnResize?: boolean | undefined;
    initialBaseWidth?: number | undefined;
}
export interface DataGridTooltipProps extends CommonInteractiveProps {
    type?: "native" | "styled" | undefined;
}
export interface ColumnVisibilityProps<DataType extends GridDataType> extends CommonInteractiveProps {
    /**
     * List of columns to display in the list.
     */
    defaultValues?: Array<{
        key: KeyLiteralType<DataType>;
        title: string;
    }>;
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
export interface ColumnDraggingProps<DataType extends GridDataType> extends CommonInteractiveProps {
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
export interface GroupedColumnProps<DataType extends GridDataType> extends CommonInteractiveProps {
    /** Collection of column groups.
     * - `title` - to display group title in grid header.
     * - `columnKeys` - collection of column keys belonging to group.
     */
    groups?: Array<{
        title: string;
        columnKeys: Array<KeyLiteralType<DataType>>;
    }> | undefined;
}
export interface RowSelectionProps extends CommonInteractiveProps {
    /**
     * - `onRowClick` - Selects if row is clicked on.
     * - `default` - Selects only if checkbox is checked.
     */
    type?: "onRowClick" | "default" | undefined;
    /**
     * Fires an event when row selection is updated.
     * @param selectedRows Collection of selected rows.
     * @returns
     */
    onChange?: (selectedRows: Array<any>) => void;
    /**
     * Fires an event when primary checkbox in table head is checked.
     * @param selectedRows Collection of selected rows.
     * @param isChecked `true` if the checkbox is checked.
     * @returns
     */
    onChangePrimarySelection?: (selectedRows: Array<any>, isChecked: boolean) => void;
    /**
     * Default selected row ids.
     */
    defaultValues?: Array<any> | undefined;
}
export interface RowActionsMenuProps<DataType> extends CommonInteractiveProps {
    /** Fires an event when action menu mounts. */
    onOpen?: (data: DataType) => void;
    /** Fires an event when action menu dismounts. */
    onHide?: () => void;
    /** Renders a list of menu items.  */
    render?: (
    /** Row data. */
    data: DataType | undefined, 
    /** Event to hide menu. */
    closeMenu: () => void) => (ActionsMenuListItem | undefined)[];
    /** Displays context menu on right click.
     * @default true
     */
    displayOnRightClick?: boolean;
}
export interface SettingsMenuProps extends CommonInteractiveProps {
    fullScreenToggle?: CommonInteractiveProps & {
        onChange?: (visible: boolean) => void;
    };
    darkModeToggle?: CommonInteractiveProps & {
        onChange?: (theme: "dark" | "light" | (string & {})) => void;
    };
    filterMenuToggle?: CommonInteractiveProps & {
        onChange?: (visible: boolean) => void;
    };
    groupedColumnToggle?: CommonInteractiveProps & {
        onChange?: (visible: boolean) => void;
    };
}
export interface FilterFnsMenuProps extends CommonInteractiveProps {
}
export interface HeaderActionsMenuProps extends CommonInteractiveProps {
}
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
    onRowExpand?: (uniqueId: DataGridRowKeyDefinition) => void;
    /** Fires an event when shrink event occurs. */
    onRowShrink?: (uniqueId: DataGridRowKeyDefinition) => void;
    /** Display separator line on the left of the row when expanded.
     * @default true
     */
    showSeparatorLine?: boolean | undefined;
}
export interface VirtualizationProps extends CommonInteractiveProps {
    /**
     * Amount of rows to render ahead of scroll event.
     * Applies to both top and bottom rows.
     * @default 5
     */
    preRenderedRowCount?: number | undefined;
    /**
     * Dynamically calculates row expansion height.
     *
     * *Experimental\*. Might cause performance issues*.
     */
    dynamicExpandRowHeight?: boolean | undefined;
}
export interface DataGridReference<DataType extends GridDataType> {
    /**
     * Gets currently selected rows.
     * @returns Collection of row `id`s.
     */
    getSelectedRows: () => Set<DataGridRowKeyDefinition>;
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
     * Retrieves pagination props.
     * @returns Pagination props.
     */
    getCurrentPagination: () => DataGridPaginationProps;
    /**
     * Resets collection of filters that are currently active.
     */
    resetCurrentFilters: () => void;
    /**
     * Clears the selected rows.
     */
    clearSelectedRows: () => void;
    /**
     * Updates currently selected rows.
     */
    updateSelectedRows: (values: DataGridRowKeyDefinition | Array<DataGridRowKeyDefinition>) => void;
}
export type ServerSideCallback = (
/** Up to date filter object. */
filters: ICurrentFilterCollection, 
/** Up to date filter functions object. */
filterFns: ICurrentFnCollection, 
/** Up to date pagination object. */
paginationProps: DataGridPaginationProps, 
/** Up to date sorting object. */
sortingProps: ICurrentSorting | undefined) => Promise<void>;
export interface ServerSideFetchingProps extends CommonInteractiveProps {
    onGlobalChangeAsync?: ServerSideCallback;
    pagination?: {
        /** Data count on the server.
         * Must be correctly supplied to construct and assign pagination properties.
         */
        dataCount?: number | undefined;
        /** Fires an event when pagination is updated. */
        onChangeAsync?: ServerSideCallback;
    };
    filtering: {
        /** Fires an event when input field's value is changed.
         * Required when select options are fetched server-side.  */
        onDefaultFilterFetchAsync?: (key: string) => Promise<string[]>;
        /** Fires an event when filtering updates. */
        onFilterChangeAsync?: ServerSideCallback;
        /** Fires an event when filtering function is updated. */
        onFilterFunctionChangeAsync?: ServerSideCallback;
    };
    sorting?: {
        /** Fires an event when sorting occurs.  */
        onSortingChangeAsync?: ServerSideCallback;
    };
}
export interface InitialDataStateProps {
    /** Up to date filter object. */
    filters?: ICurrentFilterCollection;
    /** Up to date filter functions object. */
    filterFns?: ICurrentFnCollection;
    /** Up to date pagination object. */
    paginationProps?: DataGridPaginationProps;
    /** Up to date sorting object. */
    sortingProps?: ICurrentSorting;
}
export interface DataGridProps<DataType extends GridDataType> {
    /** Data to output. Object keys must match column keys if default rendering is used. */
    data: DataType[] | undefined;
    /** Columns that will be used in the data-grid. */
    columns: ColumnDefinition<DataType>[];
    /** Identifier key of the data object. */
    uniqueRowKey: KeyLiteralType<DataType>;
    /** Initial value of data state. */
    initialDataState?: InitialDataStateProps | undefined;
    /** Displays settings menu at the bottom start of the footer. */
    settingsMenu?: SettingsMenuProps | undefined;
    /** Appends the context menu overlay to the specified node. */
    contextMenuRenderRoot?: HTMLElement | undefined;
    /** Displays three-dot context menu at the end of the row. */
    rowActionsMenu?: RowActionsMenuProps<DataType> | undefined;
    /** Displays three-dot context menu at the end of head cell. */
    headerActionsMenu?: HeaderActionsMenuProps | undefined;
    /** Displays filter functions menu next to inputs. */
    filterFnsMenu?: FilterFnsMenuProps | undefined;
    /** Displays loading-skeleton if activated. */
    loading?: boolean | undefined;
    /** Allows the ability to resize the columns. */
    resizableColumns?: ColumnResizingProps<DataType> | undefined;
    /** Allows the ability to drag columns and change their order. */
    draggableColumns?: ColumnDraggingProps<DataType> | undefined;
    /** Allows the ability for a row to expand. */
    expandableRows?: RowExpandabilityProps<DataType> | undefined;
    /** Allows the ability to group the columns under single header. */
    groupedColumns?: GroupedColumnProps<DataType> | undefined;
    /** Allows the ability to alter column visibility. */
    columnVisibilityOptions?: ColumnVisibilityProps<DataType> | undefined;
    /** Allows the ability to display tooltip on cells. */
    tooltipOptions?: DataGridTooltipProps | undefined;
    /** Allows the usage of checkboxes and row selection. */
    rowSelection?: RowSelectionProps | undefined;
    /** Allows the usage of pinning columns to either left or right. */
    pinnedColumns?: ColumnPinProps<DataType> | undefined;
    /** Adds border around data cells. */
    cellBordering?: CellBorderingProps | undefined;
    /** Allows the user to hover over the rows. */
    isHoverable?: boolean | undefined;
    /** Adjusts column width automatically. */
    autoAdjustColWidth?: AutoColWidthProps | undefined;
    /** Default pagination props to partition data. */
    pagination?: ClientPaginationProps | undefined;
    /** Default sorting props, such as event handler when sorting operation occurs. */
    sorting?: ClientSortingProps | undefined;
    /** Allows the ability to customize icons. */
    icons?: Partial<DataGridIconsDefinition> | undefined;
    /** Allows the ability to customize localization. */
    localization?: LocalizationProps | undefined;
    /** Allows the ability to customize data-grid dimensions. */
    dimensions?: Partial<DataGridDimensionsDefinition>;
    /** Allows the ability to use custom data-grid styling. */
    styling?: Partial<DataGridStylingDefinition> | undefined;
    /** Allows the ability to set custom theme. */
    theme?: "dark" | "light" | (string & {});
    /** Reference to data-grid element to provide data and column access gridTools. */
    dataGridApiRef?: React.MutableRefObject<DataGridReference<DataType> | null>;
    /** Allows the data-grid rows to contain striped background color.  */
    striped?: boolean | undefined;
    /** Improves both rendering and overall performance of the list. */
    virtualization?: VirtualizationProps | undefined;
    /** Element class to pass.  */
    className?: string | undefined;
    /** Element style to pass.  */
    style?: React.CSSProperties | undefined;
    /** Callback function to execute on row click. */
    onRowClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, 
    /** Data of the data-grid row. */
    data: DataType) => void;
    /** Configurations to allow API based filtering and pagination. */
    serverSide?: ServerSideFetchingProps;
}
export interface DataGridPaginationProps {
    /** Current page size to display. */
    pageSize?: number;
    /** Current page of data-grid. */
    currentPage?: number;
    /** Total size of data elements. */
    dataCount?: number;
}
export {};
