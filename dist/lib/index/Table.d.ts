/// <reference types="react" />
import type { TableProps } from "../types/Table";
declare function Table<DataType extends Record<string, any>>(tableProps: TableProps<DataType>): JSX.Element;
export default Table;
