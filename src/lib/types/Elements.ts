import useTableTools from "../logic/table-tools";
import { KeyLiteralType, TableProps, TableTooltipProps } from "./Table";
import { ColumnTypeExtended, FilteringProps } from "./Utils";

export type DataGridProps<DataType> = React.HtmlHTMLAttributes<HTMLDivElement> & {
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
  tools: ReturnType<typeof useTableTools<DataType>>;
  initiateColumns(): ColumnTypeExtended<DataType>[];
};

export type CellContentProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  tooltipProps?: TableTooltipProps | undefined;
};

export type ColumnHeaderProps<DataType> = {
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
  filteringProps?: FilteringProps;
};

export type ColumnHeaderFilterProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  columnKey: string;
  filteringProps?: FilteringProps;
};

export type ExpandRowProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  expandRowProps?: {
    children: React.ReactNode;
    isRowExpanded: boolean;
    showSeperatorLine: boolean;
    leftOffset?: number;
    basicColumnsWidth?: number;
  };
};

export type HeaderOrderingProps<DataType> = {
  draggingEnabled: boolean;
  columnOrder: Array<KeyLiteralType<DataType>>;
  setColumnOrder: React.Dispatch<React.SetStateAction<Array<KeyLiteralType<DataType>>>>;
  onColumnDragged?: ((columnKeys: KeyLiteralType<DataType>[]) => void) | undefined;
  columns: ColumnTypeExtended<DataType>[];
  children: React.HtmlHTMLAttributes<HTMLDivElement>["children"];
};

export type HeaderWrapperProps<DataType> = {
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
  tools: ReturnType<typeof useTableTools<DataType>>;
  onColumnHeaderFocus(e: React.FocusEvent<HTMLDivElement>, colWidth: number): void;
};

export type LockedWrapperProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  type: "header" | "body";
};

export type RowProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  totalColumnsWidth: number | string;
  isSelected?: boolean | undefined;
  expandRowProps?: {
    children: React.ReactNode;
    isRowExpanded: boolean;
    showSeperatorLine: boolean;
    leftOffset?: number;
    basicColumnsWidth?: number;
  };
};

export type ScrollerProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  minWidth: number;
  minHeight: number;
  emptySpacerVisible: boolean;
};

export type ViewContainerProps<DataType> = React.HtmlHTMLAttributes<HTMLDivElement> & {
  tp: TableProps<DataType>;
  tools: ReturnType<typeof useTableTools<DataType>>;
  containerHeight?: number | undefined;
  scrollPosition: number;
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
};

export interface VirtualListProps<DataType> {
  elements: Array<DataType>;
  containerHeight: number;
  rowHeight: number;
  scrollPosition: number;
  disabled?: boolean | undefined;
  expandRowKeys: Set<number>;
  expandPanelHeight: number;
  renderElement: (data: DataType, style: React.CSSProperties) => JSX.Element;
  uniqueRowKey: keyof DataType;
  preRenderedRowCount?: number | undefined;
}
