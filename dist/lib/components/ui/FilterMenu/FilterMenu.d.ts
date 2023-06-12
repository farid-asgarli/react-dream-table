/// <reference types="react" />
import { FilteringProps } from "../../../types/Utils";
import "./FilterMenu.scss";
export default function FilterMenu({ filterProps: { getColumnFilterValue, progressReporters, updateFilterValue, fetchFilters, multiple, prefetchedFilters, render, renderCustomInput, filterInputProps, type, isRangeInput, disableInputIcon, }, columnKey, }: {
    columnKey: string;
    filterProps: FilteringProps;
}): JSX.Element;
