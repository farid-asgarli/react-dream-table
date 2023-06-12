import { Dayjs } from "dayjs";
export declare const RDTDateFilters: {
    contains: (data: string, filterValue: Dayjs) => boolean;
    empty: (data: string) => boolean;
    notEmpty: (data: string) => boolean;
    startsWith: (data: string, filterValue: Dayjs) => boolean;
    endsWith: (data: string, filterValue: Dayjs) => boolean;
    equals: (data: string, filterValue: Dayjs) => boolean;
    notEquals: (data: string, filterValue: Dayjs) => boolean;
    greaterThan: (data: string, filterValue: Dayjs) => boolean;
    lessThan: (data: string, filterValue: Dayjs) => boolean;
    greaterThanOrEqualTo: (data: string, filterValue: Dayjs) => boolean;
    lessThanOrEqualTo: (data: string, filterValue: Dayjs) => boolean;
    between: (data: string, filterValues: [Dayjs, Dayjs]) => boolean;
    betweenInclusive: (data: string, filterValues: [Dayjs, Dayjs]) => boolean;
    equalsAlt: (data: string, filterValue: Dayjs) => boolean;
};
