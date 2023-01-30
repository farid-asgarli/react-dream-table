import { useDataManagement } from "../logic/data-management/dataManagement";
import { DisplayActionsMenu } from "../logic/tools/actions-menu-factory";
import useTableTools from "../logic/tools/table-tools";
import { KeyLiteralType, TableProps, TableTooltipProps } from "./Table";
import { ColumnTypeExtended, CompleteFilterFnType, FilteringProps } from "./Utils";

export interface DataGridProps<DataType> extends React.HtmlHTMLAttributes<HTMLDivElement> {
  theme: "dark" | "light";
  tp: TableProps<DataType>;
  pinnedColumns:
    | {
        leftColumns: ColumnTypeExtended<DataType>[];
        rightColumns: ColumnTypeExtended<DataType>[];
        leftWidth: number;
        rightWidth: number;
        totalWidth: number;
      }
    | undefined;
  totalColumnsWidth: number;
  columnsInUse: {
    columns: ColumnTypeExtended<DataType>[];
    totalWidth: number;
  };
  tableTools: ReturnType<typeof useTableTools<DataType>>;
  dataTools: ReturnType<typeof useDataManagement<DataType>>;
  initiateColumns(): ColumnTypeExtended<DataType>[];
  displayDataActionsMenu: DisplayActionsMenu<DataType>;
  displayHeaderActionsMenu: DisplayActionsMenu<DataType>;
  optionsMenu: {
    displayOptionsMenu: DisplayActionsMenu<DataType>;
    isOptionsMenuVisible: boolean;
  };
  filterFnsMenu: {
    displayFilterFnsMenu: DisplayActionsMenu<DataType>;
    activeFilterMenuKey: string | undefined;
  };
}

export interface CellContentProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  tooltipProps?: TableTooltipProps | undefined;
}

export interface ColumnHeaderProps<DataType> {
  columnProps: ColumnTypeExtended<DataType>;
  resizingProps?: {
    onMouseDown: (columnKey: string) => void;
    activeIndex?: string | undefined;
    isResizable: boolean | undefined;
  };
  draggingProps?: {
    isDraggable?: boolean | undefined;
  };
  toolBoxes?: (JSX.Element | undefined)[] | undefined;
  filterProps?: FilteringProps;
  filterFnsProps?: {
    getColumnFilterFn: (key: string) => CompleteFilterFnType;
    displayFilterFnsMenu: DisplayActionsMenu<any>;
    activeFilterMenuKey: string | undefined;
  };
}

export interface ColumnHeaderFilterProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  columnKey: string;
  filterProps?: FilteringProps;
}

export interface ExpandProps {
  children: React.ReactNode;
  isRowExpanded: boolean;
  showSeperatorLine: boolean;
  leftOffset?: number;
  basicColumnsWidth?: number;
}

export interface ExpandRowProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  expandRowProps?: ExpandProps;
}

export interface HeaderOrderingProps<DataType> {
  draggingEnabled: boolean;
  columnOrder: Array<KeyLiteralType<DataType>>;
  setColumnOrder: (collection: KeyLiteralType<DataType>[]) => void;
  onColumnDragged?: ((columnKeys: KeyLiteralType<DataType>[]) => void) | undefined;
  columns: ColumnTypeExtended<DataType>[];
  children: React.HtmlHTMLAttributes<HTMLDivElement>["children"];
}

export interface HeaderWrapperProps<DataType> {
  pinnedColumns:
    | {
        leftColumns: ColumnTypeExtended<DataType>[];
        rightColumns: ColumnTypeExtended<DataType>[];
        leftWidth: number;
        rightWidth: number;
        totalWidth: number;
      }
    | undefined;
  totalColumnsWidth: number;
  verticalScrollbarWidth: number;
  columnsInUse: {
    columns: ColumnTypeExtended<DataType>[];
    totalWidth: number;
  };
  tp: TableProps<DataType>;
  tableTools: ReturnType<typeof useTableTools<DataType>>;
  dataTools: ReturnType<typeof useDataManagement<DataType>>;
  onColumnHeaderFocus(e: React.FocusEvent<HTMLDivElement>, colWidth: number): void;
  headerActionsMenu: { displayHeaderActionsMenu: DisplayActionsMenu<DataType> };
  filterFnsMenu: {
    displayFilterFnsMenu: DisplayActionsMenu<DataType>;
    activeFilterMenuKey: string | undefined;
  };
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
}

export interface ViewContainerProps<DataType> extends React.HtmlHTMLAttributes<HTMLDivElement> {
  tp: TableProps<DataType>;
  tableTools: ReturnType<typeof useTableTools<DataType>>;
  dataTools: ReturnType<typeof useDataManagement<DataType>>;
  containerHeight?: number | undefined;
  containerWidth: number;
  topScrollPosition: number;
  pinnedColumns:
    | {
        leftColumns: ColumnTypeExtended<DataType>[];
        rightColumns: ColumnTypeExtended<DataType>[];
        leftWidth: number;
        rightWidth: number;
        totalWidth: number;
      }
    | undefined;
  columnsInUse: {
    columns: ColumnTypeExtended<DataType>[];
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
