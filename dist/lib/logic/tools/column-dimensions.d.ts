import { DataGridDimensionsDefinition, DataGridProps } from "../../types/DataGrid";
import { GridDataType } from "../../types/Utils";
export default function useColumnDimensions<DataType extends GridDataType>(gridProps: DataGridProps<DataType>, dimensions: DataGridDimensionsDefinition): {
    isColumnResizing: boolean;
    columnDimensions: Record<string, number>;
    getColumnWidth: (colKey: string) => number;
    updateColumnWidth: (key: string, newWidth: number) => void;
    updateColumnWidthMultiple: (collection: Record<string, number>) => void;
    updateColumnResizingStatus: (val: boolean) => void;
};
