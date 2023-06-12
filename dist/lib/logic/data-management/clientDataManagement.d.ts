/// <reference types="react" />
import { ColumnDefinition, KeyLiteralType, DataGridPaginationProps, DataGridProps, InitialDataStateProps } from "../../types/DataGrid";
import { DataFetchingDefinition, ICurrentFilterCollection, IPrefetchedFilter, ICurrentSorting, SortDirectionDefinition, CompleteFilterFnDefinition, ICurrentFnCollection, GridDataType } from "../../types/Utils";
export interface IClientDataManagement<DataType extends GridDataType> {
    columns: Array<ColumnDefinition<DataType>>;
    data: Array<DataType> | undefined;
    paginationProps: DataGridProps<DataType>["pagination"];
    sortingProps: DataGridProps<DataType>["sorting"];
    dataCount?: number;
    clientEvaluationDisabled?: boolean | undefined;
    initialDataState: InitialDataStateProps | undefined;
}
export declare function useClientDataManagement<DataType extends GridDataType>({ columns, data, paginationProps, dataCount, sortingProps, clientEvaluationDisabled, initialDataState, }: IClientDataManagement<DataType>): {
    currentFilterFns: ICurrentFnCollection;
    currentSorting: ICurrentSorting | undefined;
    currentFilters: ICurrentFilterCollection;
    filterResetKey: number;
    prefetchedFilters: IPrefetchedFilter;
    progressReporters: Set<DataFetchingDefinition>;
    data: DataType[];
    currentPagination: DataGridPaginationProps;
    dataWithoutPagination: DataType[] | undefined;
    getColumnType: (key: string) => "number" | "date" | "text" | "select";
    isRangeFilterFn: (fnsKey: CompleteFilterFnDefinition) => boolean;
    isFilterFnActive: (colKey: string, activeKey: string | undefined) => boolean;
    getColumn: (key: string) => ColumnDefinition<DataType> | undefined;
    getColumnFilterFn: (key: string) => {
        current: CompleteFilterFnDefinition;
        default: CompleteFilterFnDefinition | undefined;
    };
    getColumnFilterValue: (key: string) => string | string[] | undefined;
    hydrateSelectInputs: () => void;
    pipeFetchedFilters: (key: string, asyncFetchCallback?: ((key: string, inputSearchValues?: string | undefined) => Promise<string[]>) | undefined) => Promise<void>;
    resetCurrentFilters: () => Promise<ICurrentFilterCollection>;
    resetFetchedFilters: (key?: string | undefined) => void;
    resetPagination: () => DataGridPaginationProps;
    setProgressReporters: import("react").Dispatch<import("react").SetStateAction<Set<DataFetchingDefinition>>>;
    updateCurrentSorting: (key: string, alg?: SortDirectionDefinition) => Promise<ICurrentSorting>;
    updateCurrentFilterFn: (key: string, type: CompleteFilterFnDefinition) => Promise<ICurrentFnCollection>;
    updateCurrentPagination: (valuesToUpdate: DataGridPaginationProps) => Promise<DataGridPaginationProps>;
    updatePrefetchedFilters: (key: KeyLiteralType<DataType>, value: string[]) => Promise<IPrefetchedFilter>;
    updateCurrentFilterValue: (key: string, value: string | Array<string>) => Promise<ICurrentFilterCollection>;
};
