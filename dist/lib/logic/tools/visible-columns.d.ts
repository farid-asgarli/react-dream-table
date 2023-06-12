import { KeyLiteralType, DataGridProps } from "../../types/DataGrid";
import { GridDataType } from "../../types/Utils";
export default function useVisibleColumns<DataType extends GridDataType>(gridProps: DataGridProps<DataType>): {
    visibleColumns: Set<KeyLiteralType<DataType>>;
    updateColumnVisibility: (key: string) => Set<KeyLiteralType<DataType>>;
};
