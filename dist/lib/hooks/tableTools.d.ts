/// <reference types="react" />
import type { ContextMenuVisibility, FilterMenuVisibility, TableRowKeyType } from "../types/Utils";
import { TableProps } from "../types/Table";
export declare function useTableTools<DataType extends Record<string, any>>({ tableProps, styles, }: {
    tableProps: TableProps<DataType>;
    styles: Record<string, string>;
}): {
    handleMapColGroups: JSX.Element[];
    handleMapData: JSX.Element[] | undefined;
    handleMapTableHead: JSX.Element[];
    handleDisplayContextMenu: (prop?: {
        data: DataType;
        position: ContextMenuVisibility<DataType>["position"];
    } | undefined, visibility?: "visible" | "hidden" | "destroy-on-close") => void;
    handleDisplayFilterMenu: (prop?: {
        key: string;
        position: FilterMenuVisibility["position"];
    } | undefined, visibility?: "visible" | "hidden" | "destroy-on-close") => Promise<void>;
    contextMenu: ContextMenuVisibility<DataType> | undefined;
    filterMenu: FilterMenuVisibility | undefined;
    paginationProps: import("../types/Table").TablePaginationProps;
    selectedFilters: import("../types/Utils").SelectedFilterType;
    selectedRows: Set<TableRowKeyType>;
    updateInputValue: (key?: string | undefined, value?: string | undefined) => Promise<void>;
    updateSelectedFilters: (key: string, value?: string | string[] | undefined) => Promise<void>;
    updatePaginationProps: (valuesToUpdate: import("../types/Table").TablePaginationProps, shouldTriggerServerUpdate?: boolean) => void;
    fetchedFilters: import("../types/Utils").FetchedFilterType;
    inputValue: {
        [key: string]: string | undefined;
    } | undefined;
    fetching: Set<import("../types/Utils").DataFetchingType>;
    data: DataType[] | undefined;
};
