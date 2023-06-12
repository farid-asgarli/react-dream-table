import { DataGridProps } from "../../types/DataGrid";
import { DataGridRowKeyDefinition, GridDataType } from "../../types/Utils";
export default function useSelectedRows<DataType extends GridDataType>(gridProps: DataGridProps<DataType>): {
    selectedRows: Set<DataGridRowKeyDefinition>;
    updateSelectedRows: (value: DataGridRowKeyDefinition) => void;
    updateSelectedRowsMultiple: (collection: Array<DataGridRowKeyDefinition>) => void;
    isRowSelected: (uniqueRowKey: string) => boolean;
    clearSelectedRows: () => void;
};
