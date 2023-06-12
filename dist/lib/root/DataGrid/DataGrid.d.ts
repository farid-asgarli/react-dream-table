/// <reference types="react" />
import { DataGridProps } from "../../types/DataGrid";
import { GridDataType } from "../../types/Utils";
import "../../styles/theming.scss";
declare function DataGrid<DataType extends GridDataType>(gridProps: DataGridProps<DataType>): JSX.Element;
export default DataGrid;
