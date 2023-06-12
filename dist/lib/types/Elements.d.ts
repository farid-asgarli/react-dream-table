/// <reference types="react" />
import { DisplayActionsMenu } from "../logic/tools/actions-menu-factory";
import { HeaderWrapperRef } from "../root/HeaderWrapper/HeaderWrapper";
import { KeyLiteralType, DataGridProps, DataGridTooltipProps } from "./DataGrid";
import { ColumnDefinitionExtended, CompleteFilterFnDefinition, DataTools, FilteringProps, GridDataType, GridTools, GroupedColumnHeaderCollection, IndexedData } from "./Utils";
export interface DataGridFactoryProps<DataType extends GridDataType> extends React.HtmlHTMLAttributes<HTMLDivElement> {
    theme: DataGridProps<DataType>["theme"];
    gridProps: DataGridProps<DataType>;
    pinnedColumns: {
        leftColumns: ColumnDefinitionExtended<DataType>[];
        rightColumns: ColumnDefinitionExtended<DataType>[];
        leftWidth: number;
        rightWidth: number;
        totalWidth: number;
    } | undefined;
    totalColumnsWidth: number;
    columnsToRender: {
        columns: ColumnDefinitionExtended<DataType>[];
        totalWidth: number;
    };
    groupedColumnHeaders: GroupedColumnHeaderCollection;
    gridTools: GridTools<DataType>;
    dataTools: DataTools<DataType>;
    initializedColumns: ColumnDefinitionExtended<DataType>[];
    displayDataActionsMenu: DisplayActionsMenu<DataType>;
    displayHeaderActionsMenu: DisplayActionsMenu<DataType>;
    filterFnsMenu: {
        displayFilterFnsMenu: DisplayActionsMenu<DataType>;
        activeFilterMenuKey: string | undefined;
    };
    optionsMenu: {
        displayOptionsMenu: DisplayActionsMenu<DataType>;
        isVisible: boolean;
    };
}
export interface CellContentProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    tooltipProps?: DataGridTooltipProps | undefined;
}
export interface ColumnHeaderProps<DataType extends GridDataType> {
    columnProps: ColumnDefinitionExtended<DataType>;
    resizingProps?: {
        updateColumnWidth: (key: string, width: number) => void;
        updateColumnResizingStatus: (val: boolean) => void;
        isResizable: boolean | undefined;
    };
    draggingProps?: {
        isDraggable?: boolean | undefined;
    };
    toolBoxes?: (JSX.Element | undefined)[] | undefined;
    filterProps?: FilteringProps;
    filterFnsProps?: {
        getColumnFilterFn: (key: string) => {
            current: CompleteFilterFnDefinition;
            default: CompleteFilterFnDefinition | undefined;
        };
        isFilterFnActive(colKey: string, activeKey: string | undefined): boolean;
        displayFilterFnsMenu: DisplayActionsMenu<any>;
        activeFilterMenuKey: string | undefined;
    };
    containerHeight?: number;
    isFilterMenuVisible?: boolean;
}
export interface ColumnHeaderFilterWrapperProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    filterFnsProps: ColumnHeaderProps<any>["filterFnsProps"];
    columnKey: string;
}
export interface ColumnHeaderFilterProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    columnKey: string;
    filterProps?: FilteringProps;
}
export interface ExpandProps {
    children: React.ReactNode;
    isRowExpanded: boolean;
    showSeparatorLine: boolean;
    rowIndex: number;
    updateExpandRowHeightCache?(index: number, height: number, forceUpdate?: boolean): void;
    leftOffset?: number;
}
export interface ExpandRowProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    expandRowProps: ExpandProps;
}
export interface HeaderOrderingProps<DataType extends GridDataType> {
    draggingEnabled: boolean;
    columnOrder: Array<KeyLiteralType<DataType>>;
    setColumnOrder: (collection: KeyLiteralType<DataType>[]) => void;
    onColumnDragged?: ((columnKeys: KeyLiteralType<DataType>[]) => void) | undefined;
    columns: ColumnDefinitionExtended<DataType>[];
    children: React.HtmlHTMLAttributes<HTMLDivElement>["children"];
}
export interface HeaderWrapperProps<DataType extends GridDataType> {
    pinnedColumns: {
        leftColumns: ColumnDefinitionExtended<DataType>[];
        rightColumns: ColumnDefinitionExtended<DataType>[];
        leftWidth: number;
        rightWidth: number;
        totalWidth: number;
    } | undefined;
    totalColumnsWidth: number;
    verticalScrollbarWidth: number;
    columnsToRender: {
        columns: ColumnDefinitionExtended<DataType>[];
        totalWidth: number;
    };
    gridProps: DataGridProps<DataType>;
    gridTools: GridTools<DataType>;
    dataTools: DataTools<DataType>;
    onColumnHeaderFocus(e: React.FocusEvent<HTMLDivElement>, colWidth: number): void;
    headerActionsMenu: {
        displayHeaderActionsMenu: DisplayActionsMenu<DataType>;
    };
    filterFnsMenu: {
        displayFilterFnsMenu: DisplayActionsMenu<DataType>;
        activeFilterMenuKey: string | undefined;
    };
    containerHeight: number;
    headerWrapperRef: React.ForwardedRef<HeaderWrapperRef>;
    groupedColumnHeaders: GroupedColumnHeaderCollection;
}
export interface LockedWrapperProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    type: "header" | "body";
}
export interface RowProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    totalColumnsWidth: number | string;
    isRowSelected?: boolean | undefined;
    isRowActive?: boolean | undefined;
    expandRowProps?: ExpandProps;
}
export interface ScrollerProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    minWidth: number;
    minHeight: number;
    emptySpacerVisible: boolean;
    verticalScrollbarWidth: number;
}
export interface ViewContainerProps<DataType extends GridDataType> extends React.HtmlHTMLAttributes<HTMLDivElement> {
    gridProps: DataGridProps<DataType>;
    gridTools: GridTools<DataType>;
    dataTools: DataTools<DataType>;
    containerHeight: number;
    containerWidth: number;
    topScrollPosition: number;
    pinnedColumns: {
        leftColumns: ColumnDefinitionExtended<DataType>[];
        rightColumns: ColumnDefinitionExtended<DataType>[];
        leftWidth: number;
        rightWidth: number;
        totalWidth: number;
    } | undefined;
    columnsToRender: {
        columns: ColumnDefinitionExtended<DataType>[];
        totalWidth: number;
    };
    totalColumnsWidth: number;
    displayActionsMenu: DisplayActionsMenu<DataType>;
    viewRef: React.ForwardedRef<HTMLDivElement>;
    getRowExpansionHeight(index: number): number | undefined;
    indexedData: IndexedData<DataType>[];
}
export interface VirtualListProps<DataType extends GridDataType> {
    rows: Array<DataType>;
    containerHeight: number;
    rowHeight: number;
    topScrollPosition: number;
    getExpandRowHeightFromCache?: (index: number) => number | undefined;
    isDynamicExpandActive: boolean;
    expandRowKeys: Set<number>;
    expandPanelHeight: number;
    renderElement: (data: DataType, style: React.CSSProperties) => JSX.Element;
    preRenderedRowCount?: number | undefined;
    getRowExpansionHeight(index: number): number | undefined;
}
