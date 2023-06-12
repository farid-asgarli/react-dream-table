import { GridDataType } from "../../types/Utils";
export declare const RDTFilters: {
    contains: <TData extends GridDataType = {}>(data: TData, id: string, filterValue: string | number) => any;
    containsMultiple: <TData_1 extends GridDataType = {}>(data: TData_1, id: string, filterValue: (string | number)[]) => boolean;
    startsWith: <TData_2 extends GridDataType = {}>(data: TData_2, id: string, filterValue: string | number) => any;
    endsWith: <TData_3 extends GridDataType = {}>(data: TData_3, id: string, filterValue: string | number) => any;
    equals: <TData_4 extends GridDataType = {}>(data: TData_4, id: string, filterValue: string | number) => boolean;
    equalsAlt: <TData_5 extends GridDataType = {}>(data: TData_5, id: string, filterValue: string | number) => boolean;
    notEquals: <TData_6 extends GridDataType = {}>(data: TData_6, id: string, filterValue: string | number) => boolean;
    greaterThan: <TData_7 extends GridDataType = {}>(data: TData_7, id: string, filterValue: string | number) => boolean;
    lessThan: <TData_8 extends GridDataType = {}>(data: TData_8, id: string, filterValue: string | number) => boolean;
    greaterThanOrEqualTo: <TData_9 extends GridDataType = {}>(data: TData_9, id: string, filterValue: string | number) => boolean;
    lessThanOrEqualTo: <TData_10 extends GridDataType = {}>(data: TData_10, id: string, filterValue: string | number) => boolean;
    between: <TData_11 extends GridDataType = {}>(data: TData_11, id: string, filterValues: [string | number, string | number]) => boolean;
    betweenInclusive: <TData_12 extends GridDataType = {}>(data: TData_12, id: string, filterValues: [string | number, string | number]) => boolean;
    fuzzy: <TData_13 extends GridDataType = {}>(collection: TData_13[], id: string, filterValue: string) => TData_13[];
    empty: <TData_14 extends GridDataType = {}>(data: TData_14, id: string, _filterValue?: string | number) => boolean;
    notEmpty: <TData_15 extends GridDataType = {}>(data: TData_15, id: string, _filterValue?: string | number) => boolean;
};
