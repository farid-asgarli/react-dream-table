/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from "react";
import { ConstProps } from "../../static/constantProps";
import { ColumnType, KeyLiteralType, TablePaginationProps, TableProps } from "../../types/Table";
import {
  DataFetchingType,
  ICurrentFilterCollection,
  IPrefetchedFilter,
  ICurrentSorting,
  FooterProps,
  SortDirectionType,
  CompleteFilterFnType,
  ICurrentFnType,
} from "../../types/Utils";
import { assignFilterFns } from "../../utils/AssignFilterFn";
import { RDTDateFilters } from "./dateFilterFns";
import { RDTFilters } from "./filterFns";

export interface IClientDataManagement<DataType> {
  columns: Array<ColumnType<DataType>>;
  data?: Array<DataType> | undefined;
  paginationDefaults?: FooterProps<DataType>["paginationDefaults"];
  dataCount?: number;
  sortingProps?: TableProps<DataType>["sorting"];
}

export function useClientDataManagement<DataType>({
  columns,
  data,
  paginationDefaults,
  dataCount,
  sortingProps,
}: IClientDataManagement<DataType>) {
  const PAGINATION_CURRENT_PAGE = paginationDefaults?.defaultCurrentPage ?? ConstProps.defaultPaginationCurrentPage;
  const PAGINATION_PAGE_SIZE = paginationDefaults?.defaultPageSize ?? ConstProps.defaultPaginationPageSize;

  /** Collection of already fetched filters. */
  const [prefetchedFilters, setPrefetchedFilters] = useState<IPrefetchedFilter>({});

  /** Filters that are currently in use. */
  const [currentFilters, setCurrentFilters] = useState<ICurrentFilterCollection>({});

  /** Filter functions that are currently in use. */
  const [currentFilterFns, setCurrentFilterFns] = useState<ICurrentFnType>(assignFilterFns(columns));

  /** Sorting that is currently in use. */
  const [currentSorting, setCurrentSorting] = useState<ICurrentSorting | undefined>(undefined);

  /** Data fetching indicators. */
  const [progressReporters, setProgressReporters] = useState<Set<DataFetchingType>>(new Set());

  /** Table key to reset filters. */
  const [filterResetKey, setFilterResetKey] = useState(0);

  const currentSortingRef = useRef<ICurrentSorting>();
  currentSortingRef.current = currentSorting;

  const prefetchedFilterRef = useRef<IPrefetchedFilter>({});
  prefetchedFilterRef.current = prefetchedFilters;

  const pipeSorting = (data?: DataType[], filters?: ICurrentSorting) => {
    if (!data || data.length === 0) return;
    let sortedData = [...data];

    if (filters) {
      const customSortingAlg = columns.find((x) => x.key === filters.key)?.sortingProps?.sortingComparer;

      const { key, direction } = filters;
      if (customSortingAlg)
        sortedData = sortedData.sort(
          (a, b) => customSortingAlg(a[key as keyof DataType], b[key as keyof DataType], direction) as number
        );
      else
        switch (direction) {
          case "ascending":
            sortedData = sortedData.sort((a, b) => (a[key as keyof DataType] > b[key as keyof DataType] ? -1 : 1));
            break;
          case "descending":
            sortedData = sortedData.sort((a, b) => (a[key as keyof DataType] < b[key as keyof DataType] ? -1 : 1));
            break;
        }
    }
    return sortedData;
  };

  const pipeFilters = (filters: ICurrentFilterCollection, filterFns: ICurrentFnType, data?: DataType[]) => {
    if (!data || data.length === 0) return;
    let filteredData: DataType[] = [...data];
    for (const columnKey in filters) {
      const equalityFilter = columns.find((x) => x.key === columnKey)?.filteringProps;
      filteredData = filteredData.filter((data) => {
        const assignedFilters = filters[columnKey];
        if (!assignedFilters || assignedFilters?.length === 0) return true;
        switch (equalityFilter?.type) {
          case "select":
            if (equalityFilter.multipleSelection) {
              for (const f of assignedFilters)
                if (
                  (equalityFilter.equalityComparer &&
                    equalityFilter.equalityComparer?.(data[columnKey as keyof DataType], f)) ||
                  (!equalityFilter.equalityComparer && RDTFilters.equalsAlt(data as {}, columnKey, f as string))
                )
                  return true;
              return false;
            }
            return RDTFilters.equalsAlt(data as {}, columnKey, assignedFilters as string);
          default:
            if (equalityFilter?.equalityComparer)
              return equalityFilter.equalityComparer(
                assignedFilters as string,
                data[columnKey as keyof DataType],
                filterFns[columnKey] as any
              );
            else {
              if (equalityFilter?.type === "date")
                return RDTDateFilters[filterFns[columnKey]]?.((data as any)[columnKey], assignedFilters as any);
              return RDTFilters[filterFns[columnKey]](data as {}, columnKey, assignedFilters as any);
            }
        }
      });
    }
    return filteredData;
  };

  async function pipeFetchedFilters(
    key: string,
    asyncFetchCallback?: ((key: string, inputSearchValues?: string | undefined) => Promise<string[]>) | undefined
  ) {
    if (!prefetchedFilters[key]) {
      let mappedFilters: string[] | undefined;

      const column = columns.find((x) => x.key === key);

      if (column?.filteringProps?.type === "select" && column?.filteringProps?.defaultFilters) {
        mappedFilters = column.filteringProps.defaultFilters;
      } else {
        if (asyncFetchCallback) {
          mappedFilters = await asyncFetchCallback?.(key);
        } else mappedFilters = data?.flatMap((x) => `${x[key as keyof DataType]}`);
      }

      updatePrefetchedFilters(
        key,
        // Eliminate duplicate values.
        Array.from(new Set(mappedFilters))
      );
    }
  }

  const pipePagination = (data?: DataType[], pagination?: TablePaginationProps) => {
    return data?.slice(
      pagination?.pageSize! * (pagination?.currentPage! - 1),
      pagination?.pageSize! * pagination?.currentPage!
    );
  };

  const filteredData = useMemo(
    () => pipeFilters(currentFilters, currentFilterFns, data),
    [data, currentFilters, currentFilterFns]
  );

  const sortedData = useMemo(() => pipeSorting(filteredData, currentSorting), [filteredData, currentSorting]);

  const [paginationProps, setPaginationProps] = useState<TablePaginationProps>({
    currentPage: PAGINATION_CURRENT_PAGE,
    dataCount: filteredData?.length,
    pageSize: PAGINATION_PAGE_SIZE,
  });

  function updatePrefetchedFilters(key: KeyLiteralType<DataType>, value: string[]) {
    return new Promise<IPrefetchedFilter>((res) =>
      setPrefetchedFilters((prev) => {
        const updatedState = { ...prev, [key]: value };
        res(updatedState);
        return updatedState;
      })
    );
  }

  function updatePaginationProps(valuesToUpdate: TablePaginationProps) {
    return new Promise<TablePaginationProps>((res) => {
      setPaginationProps((prev) => {
        const updatedState = { ...prev, ...valuesToUpdate };
        res(updatedState);
        return updatedState;
      });
    });
  }

  function getColumnFilterValue(key: string) {
    return currentFilters[key];
  }

  function getColumnFilterFn(key: string) {
    return currentFilterFns[key];
  }

  function getColumnType(key: string) {
    return columns.find((x) => x.key === key)?.filteringProps?.type ?? "text";
  }

  function isRangeFilterFn(fnsKey: CompleteFilterFnType) {
    const rangeFilterFns: CompleteFilterFnType[] = ["between", "betweenInclusive"];
    return rangeFilterFns.includes(fnsKey);
  }

  function updateCurrentFilterFn(key: string, type: CompleteFilterFnType) {
    if (isRangeFilterFn(type) && !isRangeFilterFn(currentFilterFns[key])) {
      setCurrentFilters((prev) => ({ ...prev, [key]: [prev[key] as string] }));
    } else if (!isRangeFilterFn(type) && isRangeFilterFn(currentFilterFns[key])) {
      setCurrentFilters((prev) => ({ ...prev, [key]: prev[key]?.[0] }));
    }

    const stateCopy = { ...currentFilterFns, [key]: type };
    setCurrentFilterFns(stateCopy);
    return stateCopy;
  }

  function updateCurrentFilterValue(key: string, value: string | Array<string>) {
    return new Promise<ICurrentFilterCollection>((res) => {
      setCurrentFilters((prev) => {
        const updatedState = {
          ...prev,
          [key]: value,
        };
        res(updatedState);
        return updatedState;
      });
    });
  }

  function resetCurrentFilters() {
    return new Promise<ICurrentFilterCollection>((res) => {
      const emptyState = {} as ICurrentFilterCollection;
      setCurrentFilters(emptyState);
      setFilterResetKey(Date.now());
      res(emptyState);
    });
  }

  function resetFetchedFilters(key?: string | undefined) {
    if (key) updatePrefetchedFilters(key, []);
  }

  function sortData(key: string, alg?: SortDirectionType) {
    if (alg) {
      const updatedState = {
        key,
        direction: alg,
      };
      setCurrentSorting(updatedState);
      return Promise.resolve(updatedState);
    }
    return new Promise<ICurrentSorting>((res) => {
      setCurrentSorting((prev) => {
        let updatedState: ICurrentSorting;
        if (prev?.key && prev.key === key) {
          let sortType: SortDirectionType;
          switch (prev.direction) {
            case "ascending":
              sortType = "descending";
              break;
            case "descending":
              sortType = undefined;
              break;
            default:
              sortType = "ascending";
              break;
          }

          updatedState = {
            key,
            direction: sortType,
          };
        } else
          updatedState = {
            key,
            direction: "ascending",
          };

        res(updatedState);
        return updatedState;
      });
    });
  }

  useEffect(() => {
    if (filteredData && filteredData.length > 0)
      setPaginationProps((prev) => ({
        ...prev,
        dataCount: dataCount ?? filteredData.length,
      }));
  }, [dataCount, filteredData]);

  useEffect(() => {
    if (currentSorting) {
      sortingProps?.onSortingChange?.(
        currentSortingRef.current!.key,
        currentSortingRef.current?.direction,
        sortedData!
      );
    }
  }, [currentSorting]);

  const dataToExport = useMemo(() => pipePagination(sortedData, paginationProps), [paginationProps, sortedData]);

  return {
    currentFilterFns,
    currentSorting,
    currentFilters,
    paginationProps,
    filterResetKey,
    prefetchedFilters,
    progressReporters,
    data: dataToExport,
    dataWithoutPagination: sortedData,
    sortData,
    getColumnType,
    isRangeFilterFn,
    getColumnFilterFn,
    getColumnFilterValue,
    setPaginationProps,
    pipeFetchedFilters,
    resetCurrentFilters,
    resetFetchedFilters,
    setProgressReporters,
    updateCurrentFilterFn,
    updatePaginationProps,
    updatePrefetchedFilters,
    updateCurrentFilterValue,
  };
}
