/// <reference types="react" />
import { DataGridLocalizationDefinition } from "../../../types/DataGrid";
import { CompleteFilterFnDefinition, DataTools, GridDataType } from "../../../types/Utils";
export declare const renderFilterFnsActionsMenu: <DataType extends GridDataType>(key: string, hideMenu: () => void, dataTools: {
    currentFilterFns: import("../../../types/Utils").ICurrentFnCollection;
    currentSorting: import("../../../types/Utils").ICurrentSorting | undefined;
    currentFilters: import("../../../types/Utils").ICurrentFilterCollection;
    filterResetKey: number;
    prefetchedFilters: import("../../../types/Utils").IPrefetchedFilter;
    progressReporters: Set<import("../../../types/Utils").DataFetchingDefinition>;
    data: DataType[];
    currentPagination: import("../../../types/DataGrid").DataGridPaginationProps;
    dataWithoutPagination: DataType[] | undefined;
    getColumnType: (key: string) => "number" | "date" | "text" | "select";
    isRangeFilterFn: (fnsKey: CompleteFilterFnDefinition) => boolean;
    isFilterFnActive: (colKey: string, activeKey: string | undefined) => boolean;
    getColumn: (key: string) => import("../../../types/DataGrid").ColumnDefinition<DataType> | undefined;
    getColumnFilterFn: (key: string) => {
        current: CompleteFilterFnDefinition;
        default: CompleteFilterFnDefinition | undefined;
    };
    getColumnFilterValue: (key: string) => string | string[] | undefined;
    hydrateSelectInputs: () => void;
    pipeFetchedFilters: (key: string, asyncFetchCallback?: ((key: string, inputSearchValues?: string | undefined) => Promise<string[]>) | undefined) => Promise<void>;
    resetCurrentFilters: () => Promise<import("../../../types/Utils").ICurrentFilterCollection>;
    resetFetchedFilters: (key?: string | undefined) => void;
    resetPagination: () => import("../../../types/DataGrid").DataGridPaginationProps;
    setProgressReporters: import("react").Dispatch<import("react").SetStateAction<Set<import("../../../types/Utils").DataFetchingDefinition>>>;
    updateCurrentSorting: (key: string, alg?: import("../../../types/Utils").SortDirectionDefinition) => Promise<import("../../../types/Utils").ICurrentSorting>;
    updateCurrentFilterFn: (key: string, type: CompleteFilterFnDefinition) => Promise<import("../../../types/Utils").ICurrentFnCollection>;
    updateCurrentPagination: (valuesToUpdate: import("../../../types/DataGrid").DataGridPaginationProps) => Promise<import("../../../types/DataGrid").DataGridPaginationProps>;
    updatePrefetchedFilters: (key: import("../../../types/DataGrid").KeyLiteralType<DataType>, value: string[]) => Promise<import("../../../types/Utils").IPrefetchedFilter>;
    updateCurrentFilterValue: (key: string, value: string | string[]) => Promise<import("../../../types/Utils").ICurrentFilterCollection>;
} | {
    data: DataType[] | undefined;
    isFetching: boolean;
    paginationProps: {
        dataCount: number | undefined;
        pageSize?: number | undefined;
        currentPage?: number | undefined;
    };
    updateCurrentPagination: (valuesToUpdate: import("../../../types/DataGrid").DataGridPaginationProps) => Promise<import("../../../types/DataGrid").DataGridPaginationProps>;
    updateCurrentFilterValue: (key: string, value: string | string[]) => Promise<import("../../../types/Utils").ICurrentFilterCollection>;
    pipeFetchedFilters: (key: string) => Promise<void>;
    resetCurrentFilters: () => Promise<import("../../../types/Utils").ICurrentFilterCollection>;
    updateCurrentFilterFn: (key: string, type: CompleteFilterFnDefinition) => Promise<import("../../../types/Utils").ICurrentFnCollection>;
    updateCurrentSorting: (key: string, alg?: import("../../../types/Utils").SortDirectionDefinition) => Promise<import("../../../types/Utils").ICurrentSorting>;
    currentFilterFns: import("../../../types/Utils").ICurrentFnCollection;
    currentSorting: import("../../../types/Utils").ICurrentSorting | undefined;
    currentFilters: import("../../../types/Utils").ICurrentFilterCollection;
    filterResetKey: number;
    prefetchedFilters: import("../../../types/Utils").IPrefetchedFilter;
    progressReporters: Set<import("../../../types/Utils").DataFetchingDefinition>;
    currentPagination: import("../../../types/DataGrid").DataGridPaginationProps;
    dataWithoutPagination: DataType[] | undefined;
    getColumnType: (key: string) => "number" | "date" | "text" | "select";
    isRangeFilterFn: (fnsKey: CompleteFilterFnDefinition) => boolean;
    isFilterFnActive: (colKey: string, activeKey: string | undefined) => boolean;
    getColumn: (key: string) => import("../../../types/DataGrid").ColumnDefinition<DataType> | undefined;
    getColumnFilterFn: (key: string) => {
        current: CompleteFilterFnDefinition;
        default: CompleteFilterFnDefinition | undefined;
    };
    getColumnFilterValue: (key: string) => string | string[] | undefined;
    hydrateSelectInputs: () => void;
    resetFetchedFilters: (key?: string | undefined) => void;
    resetPagination: () => import("../../../types/DataGrid").DataGridPaginationProps;
    setProgressReporters: import("react").Dispatch<import("react").SetStateAction<Set<import("../../../types/Utils").DataFetchingDefinition>>>;
    updatePrefetchedFilters: (key: import("../../../types/DataGrid").KeyLiteralType<DataType>, value: string[]) => Promise<import("../../../types/Utils").IPrefetchedFilter>;
}, localization: DataGridLocalizationDefinition) => ({
    content: JSX.Element;
    isSelected: boolean;
    onClick: () => void;
} | {
    content?: undefined;
    isSelected?: undefined;
    onClick?: undefined;
})[];
