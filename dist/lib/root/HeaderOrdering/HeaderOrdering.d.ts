/// <reference types="react" />
import { HeaderOrderingProps } from "../../types/Elements";
import { GridDataType } from "../../types/Utils";
export default function HeaderOrdering<DataType extends GridDataType>({ columnOrder, columns, setColumnOrder, draggingEnabled, onColumnDragged, children, }: HeaderOrderingProps<DataType>): JSX.Element;
