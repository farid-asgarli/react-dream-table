/// <reference types="react" />
import { DataGridProps } from "../../types/DataGrid";
import { GridDataType } from "../../types/Utils";
export default function useExpandedRows<DataType extends GridDataType>(gridProps: DataGridProps<DataType>): {
    expandedRowKeys: Set<number>;
    expandRowHeightCache: Record<number, number | undefined>;
    updateRowExpansion: (index: number) => void;
    closeExpandedRows: () => void;
    isRowExpanded: (uniqueRowKey: number) => boolean;
    updateExpandRowHeightCache: (index: number, height: number, forceUpdate?: boolean) => void;
    clearExpandRowHeightCache: () => void;
    getExpandRowHeightFromCache: (index: number) => number | undefined;
    isDynamicRowExpandHeightEnabled: boolean;
    __lastExpRowCache: import("react").MutableRefObject<{
        index: number;
        isOpen: boolean;
    } | null>;
};
