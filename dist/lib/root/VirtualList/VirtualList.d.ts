/// <reference types="react" />
import { VirtualListProps } from "../../types/Elements";
import { IndexedData } from "../../types/Utils";
export default function VirtualList<DataType extends IndexedData>({ rows, rowHeight, expandRowKeys, renderElement, containerHeight, expandPanelHeight, topScrollPosition, isDynamicExpandActive, getRowExpansionHeight, preRenderedRowCount, }: VirtualListProps<DataType>): JSX.Element;
