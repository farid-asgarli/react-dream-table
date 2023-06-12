import { IndexedData } from "../../types/Utils";
import useExpandedRows from "./expanded-rows";
export declare function useVirtualizedRows<DataType extends Record<string, any>>(data: IndexedData<DataType>[] | undefined, expandedRowTools: Pick<ReturnType<typeof useExpandedRows<DataType>>, "getExpandRowHeightFromCache" | "expandedRowKeys" | "isDynamicRowExpandHeightEnabled" | "expandRowHeightCache" | "__lastExpRowCache">, defaultExpandPanelHeight: number, isVirtualizationEnabled: boolean): {
    getRowExpansionHeight: (index: number) => number | undefined;
    getTotalExpansionHeight: number | undefined;
};
