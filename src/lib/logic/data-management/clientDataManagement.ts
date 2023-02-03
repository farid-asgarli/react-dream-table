/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from "react";
import { StringExtensions } from "../../extensions/String";
import { ConstProps } from "../../static/constantProps";
import { ColumnDefinition, KeyLiteralType, DataGridPaginationProps, DataGridProps, InputCommonFiltering } from "../../types/DataGrid";
import {
  DataFetchingDefinition,
  ICurrentFilterCollection,
  IPrefetchedFilter,
  ICurrentSorting,
  FooterProps,
  SortDirectionDefinition,
  CompleteFilterFnDefinition,
  ICurrentFnCollection,
  BaseFilterFnDefinition,
} from "../../types/Utils";
import { assignFilterFns } from "../../utils/AssignFilterFn";
import { RDTDateFilters } from "./dateFilterFns";
import { RDTFilters } from "./filterFns";

export interface IClientDataManagement<DataType> {
  columns: Array<ColumnDefinition<DataType>>;
  data?: Array<DataType> | undefined;
  paginationDefaults?: FooterProps<DataType>["paginationDefaults"];
  dataCount?: number;
  sortingProps?: DataGridProps<DataType>["sorting"];
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
  const [currentFilterFns, setCurrentFilterFns] = useState<ICurrentFnCollection>(assignFilterFns(columns));

  /** Sorting that is currently in use. */
  const [currentSorting, setCurrentSorting] = useState<ICurrentSorting | undefined>(undefined);

  /** Data fetching indicators. */
  const [progressReporters, setProgressReporters] = useState<Set<DataFetchingDefinition>>(new Set());

  /** DataGrid key to reset filters. */
  const [filterResetKey, setFilterResetKey] = useState(0);

  const currentSortingRef = useRef<ICurrentSorting>();
  currentSortingRef.current = currentSorting;

  const prefetchedFilterRef = useRef<IPrefetchedFilter>({});
  prefetchedFilterRef.current = prefetchedFilters;

  const pipeSorting = (data?: DataType[], filters?: ICurrentSorting) => {
    if (!data || data.length === 0) return;
    let sortedData = [...data];

    if (filters) {
      const customSortingAlg = getColumn(filters.key)?.sortingProps?.sortingComparer;

      const { key, direction } = filters;
      if (customSortingAlg)
        sortedData = sortedData.sort((a, b) => customSortingAlg(a[key as keyof DataType], b[key as keyof DataType], direction) as number);
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

  const pipeFilters = (filters: ICurrentFilterCollection, filterFns: ICurrentFnCollection, data?: DataType[]) => {
    if (!data || data.length === 0) return;
    let dataToFilter: DataType[] = [...data];

    function reFilter(fn: (d: DataType) => boolean) {
      dataToFilter = dataToFilter.filter(fn);
    }

    for (const columnKey in filters) {
      /** Currently based filters of column. */
      const currentColFilter = getColumnFilterValue(columnKey);
      /** Column based filter props, if any added. */
      const colFilterProps = getColumn(columnKey)?.filteringProps;
      /** Column filter functions (RDT Filters). */
      const colFilterFn = getColumnFilterFn(columnKey).current;
      if (!ConstProps.defaultFnsNoFilter.includes(colFilterFn) && (!currentColFilter || currentColFilter?.length === 0)) continue;
      switch (colFilterProps?.type) {
        case "select":
          if (colFilterProps?.multipleSelection) {
            for (const filterValue of currentColFilter!)
              if (colFilterProps?.equalityComparer)
                reFilter((d) => colFilterProps.equalityComparer!(d[columnKey as keyof DataType], filterValue));
              else reFilter((d) => RDTFilters.equalsAlt(d as {}, columnKey, filterValue as string));
          } else reFilter((d) => RDTFilters.equalsAlt(d as {}, columnKey, currentColFilter as string));
          break;
        default:
          if (colFilterProps?.equalityComparer)
            reFilter((d) =>
              colFilterProps.equalityComparer!(currentColFilter as string, d[columnKey as keyof DataType], filterFns[columnKey] as any)
            );
          else {
            if (colFilterProps?.type === "date")
              reFilter((d) =>
                RDTDateFilters[colFilterFn as BaseFilterFnDefinition]?.((d as Record<string, any>)[columnKey], currentColFilter as any)
              );
            else {
              if (colFilterFn === "fuzzy")
                dataToFilter = RDTFilters.fuzzy(dataToFilter as {}[], columnKey, currentColFilter as string) as DataType[];
              else
                reFilter((d) =>
                  RDTFilters[colFilterFn as BaseFilterFnDefinition](d as Record<string, any>, columnKey, currentColFilter as any)
                );
            }
          }
          break;
      }
    }
    return dataToFilter;
  };

  async function pipeFetchedFilters(
    key: string,
    asyncFetchCallback?: ((key: string, inputSearchValues?: string | undefined) => Promise<string[]>) | undefined
  ) {
    if (!prefetchedFilters[key]) {
      let mappedFilters: string[] | undefined;

      const column = getColumn(key);

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

  const pipePagination = (data?: DataType[], pagination?: DataGridPaginationProps) => {
    return data?.slice(pagination?.pageSize! * (pagination?.currentPage! - 1), pagination?.pageSize! * pagination?.currentPage!);
  };

  const filteredData = useMemo(() => pipeFilters(currentFilters, currentFilterFns, data), [data, currentFilters, currentFilterFns]);

  const sortedData = useMemo(() => pipeSorting(filteredData, currentSorting), [filteredData, currentSorting]);

  const [paginationProps, setPaginationProps] = useState<DataGridPaginationProps>({
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

  function updatePaginationProps(valuesToUpdate: DataGridPaginationProps) {
    return new Promise<DataGridPaginationProps>((res) => {
      setPaginationProps((prev) => {
        const updatedState = { ...prev, ...valuesToUpdate };
        res(updatedState);
        return updatedState;
      });
    });
  }

  function getColumn(key: string) {
    return columns.find((x) => x.key === key);
  }

  function getColumnFilterValue(key: string) {
    return currentFilters[key];
  }

  function getColumnFilterFn(key: string) {
    const columnFilterProps = getColumn(key)?.filteringProps;
    return {
      current: currentFilterFns[key],
      default: (columnFilterProps as InputCommonFiltering)?.defaultFilterFn,
    };
  }

  function getColumnType(key: string) {
    return getColumn(key)?.filteringProps?.type ?? "text";
  }

  function isFilterFnActive(colKey: string, activeKey: string | undefined) {
    const colType = getColumnType(colKey);
    const colFilterFn = getColumnFilterFn(colKey);
    const defaultAssignedFn = colFilterFn.default ?? (colType === "date" ? ConstProps.defaultActiveDateFn : ConstProps.defaultActiveFn);
    return activeKey === colKey || defaultAssignedFn !== colFilterFn.current;
  }

  function isRangeFilterFn(fnsKey: CompleteFilterFnDefinition) {
    return ConstProps.defaultRangeFns.includes(fnsKey);
  }

  function updateCurrentFilterFn(key: string, type: CompleteFilterFnDefinition) {
    if (isRangeFilterFn(type) && !isRangeFilterFn(currentFilterFns[key])) {
      setCurrentFilters((prev) => ({ ...prev, [key]: [prev[key] as string] }));
    } else if (!isRangeFilterFn(type) && isRangeFilterFn(currentFilterFns[key])) {
      setCurrentFilters((prev) => ({ ...prev, [key]: prev[key]?.[0] }));
    }

    if (ConstProps.defaultFnsNoFilter.includes(type) && currentFilters[key] === undefined) {
      setCurrentFilters((prev) => ({ ...prev, [key]: StringExtensions.Empty }));
    }

    const stateCopy = { ...currentFilterFns, [key]: type };
    setCurrentFilterFns(stateCopy);
    return Promise.resolve<ICurrentFnCollection>(stateCopy);
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

  function sortData(key: string, alg?: SortDirectionDefinition) {
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
          let sortType: SortDirectionDefinition;
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
      sortingProps?.onSortingChange?.(currentSortingRef.current!.key, currentSortingRef.current?.direction, sortedData!);
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
    isFilterFnActive,
    getColumn,
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
