import { KeyLiteralType, DataGridProps } from "../../types/DataGrid";
import { GridDataType } from "../../types/Utils";
export default function useColumnOrder<DataType extends GridDataType>(gridProps: DataGridProps<DataType>): {
    columnOrder: KeyLiteralType<DataType>[];
    updateColumnOrder: (collection: Array<KeyLiteralType<DataType>>) => void;
};
