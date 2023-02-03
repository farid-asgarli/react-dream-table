import { useDataManagement } from "../logic/data-management/dataManagement";
import { DisplayActionsMenu } from "../logic/tools/actions-menu-factory";
import useDataGridTools from "../logic/tools/datagrid-tools";
import { KeyLiteralType, DataGridProps, DataGridTooltipProps } from "./DataGrid";
import { ColumnDefinitionExtended, CompleteFilterFnDefinition, FilteringProps } from "./Utils";

export interface DataGridFactoryProps<DataType> extends React.HtmlHTMLAttributes<HTMLDivElement> {
  theme: "dark" | "light";
  tp: DataGridProps<DataType>;
  pinnedColumns:
    | {
        leftColumns: ColumnDefinitionExtended<DataType>[];
        rightColumns: ColumnDefinitionExtended<DataType>[];
        leftWidth: number;
        rightWidth: number;
        totalWidth: number;
      }
    | undefined;
  totalColumnsWidth: number;
  columnsInUse: {
    columns: ColumnDefinitionExtended<DataType>[];
    totalWidth: number;
  };
  tableTools: ReturnType<typeof useDataGridTools<DataType>>;
  dataTools: ReturnType<typeof useDataManagement<DataType>>;
  initiateColumns(): ColumnDefinitionExtended<DataType>[];
  displayDataActionsMenu: DisplayActionsMenu<DataType>;
  displayHeaderActionsMenu: DisplayActionsMenu<DataType>;
  filterFnsMenu: {
    displayFilterFnsMenu: DisplayActionsMenu<DataType>;
    activeFilterMenuKey: string | undefined;
  };
}

export interface CellContentProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  tooltipProps?: DataGridTooltipProps | undefined;
}

export interface ColumnHeaderProps<DataType> {
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
  leftOffset?: number;
  basicColumnsWidth?: number;
}

export interface ExpandRowProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  expandRowProps: ExpandProps;
}

export interface HeaderOrderingProps<DataType> {
  draggingEnabled: boolean;
  columnOrder: Array<KeyLiteralType<DataType>>;
  setColumnOrder: (collection: KeyLiteralType<DataType>[]) => void;
  onColumnDragged?: ((columnKeys: KeyLiteralType<DataType>[]) => void) | undefined;
  columns: ColumnDefinitionExtended<DataType>[];
  children: React.HtmlHTMLAttributes<HTMLDivElement>["children"];
}

export interface HeaderWrapperProps<DataType> {
  pinnedColumns:
    | {
        leftColumns: ColumnDefinitionExtended<DataType>[];
        rightColumns: ColumnDefinitionExtended<DataType>[];
        leftWidth: number;
        rightWidth: number;
        totalWidth: number;
      }
    | undefined;
  totalColumnsWidth: number;
  verticalScrollbarWidth: number;
  columnsInUse: {
    columns: ColumnDefinitionExtended<DataType>[];
    totalWidth: number;
  };
  tp: DataGridProps<DataType>;
  tableTools: ReturnType<typeof useDataGridTools<DataType>>;
  dataTools: ReturnType<typeof useDataManagement<DataType>>;
  onColumnHeaderFocus(e: React.FocusEvent<HTMLDivElement>, colWidth: number): void;
  headerActionsMenu: { displayHeaderActionsMenu: DisplayActionsMenu<DataType> };
  filterFnsMenu: {
    displayFilterFnsMenu: DisplayActionsMenu<DataType>;
    activeFilterMenuKey: string | undefined;
  };
  containerHeight: number;
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

export interface ViewContainerProps<DataType> extends React.HtmlHTMLAttributes<HTMLDivElement> {
  tp: DataGridProps<DataType>;
  tableTools: ReturnType<typeof useDataGridTools<DataType>>;
  dataTools: ReturnType<typeof useDataManagement<DataType>>;
  containerHeight?: number | undefined;
  containerWidth: number;
  topScrollPosition: number;
  pinnedColumns:
    | {
        leftColumns: ColumnDefinitionExtended<DataType>[];
        rightColumns: ColumnDefinitionExtended<DataType>[];
        leftWidth: number;
        rightWidth: number;
        totalWidth: number;
      }
    | undefined;
  columnsInUse: {
    columns: ColumnDefinitionExtended<DataType>[];
    totalWidth: number;
  };
  totalColumnsWidth: number;
  displayActionsMenu: DisplayActionsMenu<DataType>;
}

export interface VirtualListProps<DataType> {
  elements: Array<DataType>;
  containerHeight: number;
  rowHeight: number;
  topScrollPosition: number;
  disabled?: boolean | undefined;
  expandRowKeys: Set<number>;
  expandPanelHeight: number;
  renderElement: (data: DataType, style: React.CSSProperties) => JSX.Element;
  uniqueRowKey: keyof DataType;
  preRenderedRowCount?: number | undefined;
}
