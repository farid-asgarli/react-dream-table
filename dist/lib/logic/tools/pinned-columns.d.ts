import { KeyLiteralType, DataGridProps } from "../../types/DataGrid";
import { GridDataType } from "../../types/Utils";
export default function usePinnedColumns<DataType extends GridDataType>(gridProps: DataGridProps<DataType>): {
    pinnedColumns: {
        left: Array<KeyLiteralType<DataType>>;
        right: Array<KeyLiteralType<DataType>>;
    };
    updatePinnedColumns: (colKey: string, position: "left" | "right") => void;
};
