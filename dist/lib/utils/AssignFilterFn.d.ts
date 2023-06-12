import { ColumnDefinition } from "../types/DataGrid";
import { GridDataType, ICurrentFnCollection } from "../types/Utils";
export declare const assignFilterFns: <DataType extends GridDataType>(columns: ColumnDefinition<DataType>[]) => ICurrentFnCollection;
