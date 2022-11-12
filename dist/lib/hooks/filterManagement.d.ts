import { ColumnType, TablePaginationProps, TableProps } from "../types/Table";
import { DataFetchingType, SelectedFilterType, FetchedFilterType, PaginationTableProps } from "../types/Utils";
export declare function useFilterManagement<DataType extends Record<string, any>>(columns: ColumnType<DataType>[], data?: DataType[], serverSide?: TableProps<DataType>["serverSide"], paginationDefaults?: PaginationTableProps["paginationDefaults"]): {
    fetchedFilters: FetchedFilterType;
    selectedFilters: SelectedFilterType;
    inputValue: {
        [key: string]: string | undefined;
    } | undefined;
    updateInputValue: (key?: string, value?: string) => Promise<void>;
    updateSelectedFilters: (key: string, value?: string | string[]) => Promise<void>;
    paginationProps: TablePaginationProps;
    updatePaginationProps: (valuesToUpdate: TablePaginationProps, shouldTriggerServerUpdate?: boolean) => void;
    pipeFetchedFilters: (key: string) => Promise<void>;
    resetFetchedFilters: (key?: string | undefined) => void;
    fetching: Set<DataFetchingType>;
    data: DataType[] | undefined;
};
