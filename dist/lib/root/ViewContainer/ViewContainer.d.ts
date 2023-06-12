/// <reference types="react" />
import { GridDataType } from "../../types/Utils";
import { ViewContainerProps } from "../../types/Elements";
import "./ViewContainer.scss";
declare const ViewContainer: <DataType extends GridDataType>({ gridProps, dataTools, gridTools, containerHeight, topScrollPosition, columnsToRender, pinnedColumns, totalColumnsWidth, containerWidth, displayActionsMenu, getRowExpansionHeight, viewRef, indexedData, ...props }: ViewContainerProps<DataType>) => JSX.Element;
export default ViewContainer;
