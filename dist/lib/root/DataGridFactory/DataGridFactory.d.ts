/// <reference types="react" />
import { DataGridFactoryProps } from "../../types/Elements";
import { GridDataType } from "../../types/Utils";
import "./DataGridFactory.scss";
declare function DataGrid<DataType extends GridDataType>({ theme, gridProps, gridTools, dataTools, pinnedColumns, totalColumnsWidth, columnsToRender, initializedColumns, groupedColumnHeaders, children, displayDataActionsMenu, displayHeaderActionsMenu, filterFnsMenu, optionsMenu, ...props }: DataGridFactoryProps<DataType>): JSX.Element;
export default DataGrid;
