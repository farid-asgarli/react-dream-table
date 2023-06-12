/// <reference types="react" />
import { DataGridPaginationProps, ServerSideFetchingProps } from "../../types/DataGrid";
import { CompleteFilterFnDefinition, DataFetchingDefinition, GridDataType, SortDirectionDefinition } from "../../types/Utils";
import { IClientDataManagement } from "./clientDataManagement";
export interface IServerDataManagement<DataType extends GridDataType> extends IClientDataManagement<DataType> {
    serverSide?: ServerSideFetchingProps;
}
export declare function useServerDataManagement<DataType extends GridDataType>({ columns, data, dataCount, paginationProps, serverSide, sortingProps, initialDataState, }: IServerDataManagement<DataType>): {
    data: DataType[] | undefined;
    isFetching: boolean;
    paginationProps: {
        dataCount: number | undefined;
        pageSize?: number | undefined;
        currentPage?: number | undefined;
    };
    updateCurrentPagination: (valuesToUpdate: DataGridPaginationProps) => Promise<DataGridPaginationProps>;
    updateCurrentFilterValue: (key: string, value: string | Array<string>) => Promise<import("../../types/Utils").ICurrentFilterCollection>;
    pipeFetchedFilters: (key: string) => Promise<void>;
    resetCurrentFilters: () => Promise<import("../../types/Utils").ICurrentFilterCollection>;
    updateCurrentFilterFn: (key: string, type: CompleteFilterFnDefinition) => Promise<import("../../types/Utils").ICurrentFnCollection>;
    updateCurrentSorting: (key: string, alg?: SortDirectionDefinition) => Promise<import("../../types/Utils").ICurrentSorting>;
    currentFilterFns: import("../../types/Utils").ICurrentFnCollection;
    currentSorting: import("../../types/Utils").ICurrentSorting | undefined;
    currentFilters: import("../../types/Utils").ICurrentFilterCollection;
    filterResetKey: number;
    prefetchedFilters: import("../../types/Utils").IPrefetchedFilter;
    progressReporters: Set<DataFetchingDefinition>;
    currentPagination: DataGridPaginationProps;
    dataWithoutPagination: DataType[] | undefined;
    getColumnType: (key: string) => "number" | "date" | "text" | "select";
    isRangeFilterFn: (fnsKey: CompleteFilterFnDefinition) => boolean;
    isFilterFnActive: (colKey: string, activeKey: string | undefined) => boolean;
    getColumn: (key: string) => import("../../types/DataGrid").ColumnDefinition<DataType> | undefined;
    getColumnFilterFn: (key: string) => {
        current: CompleteFilterFnDefinition;
        default: CompleteFilterFnDefinition | undefined;
    };
    getColumnFilterValue: (key: string) => string | string[] | undefined;
    hydrateSelectInputs: () => void;
    resetFetchedFilters: (key?: string | undefined) => void;
    resetPagination: () => DataGridPaginationProps;
    setProgressReporters: import("react").Dispatch<import("react").SetStateAction<Set<DataFetchingDefinition>>>;
    updatePrefetchedFilters: (key: import("../../types/DataGrid").KeyLiteralType<DataType>, value: string[]) => Promise<import("../../types/Utils").IPrefetchedFilter>;
};
