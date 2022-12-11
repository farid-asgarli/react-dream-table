/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ColumnType, FilterDisplayStrategy, TablePaginationProps, TableProps } from "../types/Table";
import {
  DataFetchingType,
  IAbstractInputCollection,
  IFilterInputCollection,
  IPrefetchedFilter,
  ISelectedFilter,
  ISortingFilter,
  PaginationContainerProps,
  SortDirectionType,
} from "../types/Utils";

export interface IClientDataManagement<DataType> {
  columns: Array<ColumnType<DataType>>;
  filterDisplayStrategy: FilterDisplayStrategy;
  data?: Array<DataType> | undefined;
  paginationDefaults?: PaginationContainerProps["paginationDefaults"];
  dataCount?: number;
  sortingProps?: TableProps<DataType>["sorting"];
}

export function useClientDataManagement<DataType extends Record<string, any>>({
  columns,
  filterDisplayStrategy,
  data,
  paginationDefaults,
  dataCount,
  sortingProps,
}: IClientDataManagement<DataType>) {
  const PAGINATION_CURRENT_PAGE = paginationDefaults?.defaultCurrentPage ?? 1;
  const PAGINATION_PAGE_SIZE = paginationDefaults?.defaultPageSize ?? 10;

  /** Collection of already fetched filters. */
  const [prefetchedFilters, setPrefetchedFilters] = useState<IPrefetchedFilter>({});

  /** Collection of user selected filters. */
  const [selectedFilters, setSelectedFilters] = useState<ISelectedFilter>({});

  /** Search input value in filter menu. */
  const [inputValue, setInputValue] = useState<IFilterInputCollection>({});

  const [abstractFilters, setAbstractFilters] = useState<IAbstractInputCollection>({});

  /** Sorting that is currently in use. */
  const [currentSortFilter, setCurrentSortFilter] = useState<ISortingFilter | undefined>(undefined);

  const [progressReporters, setProgressReporters] = useState<Set<DataFetchingType>>(new Set());

  const currentSortFilterRef = useRef<ISortingFilter>();
  currentSortFilterRef.current = currentSortFilter;

  const prefetchedFilterRef = useRef<IPrefetchedFilter>({});
  prefetchedFilterRef.current = prefetchedFilters;

  const pipeSorting = (data?: DataType[], filters?: ISortingFilter) => {
    if (!data || data.length === 0) return;
    let sortedData = [...data];

    if (filters) {
      const customSortingAlg = columns.find((x) => x.key === filters.key)?.sortingProps?.sortingComparer;

      const { key, direction } = filters;
      if (customSortingAlg) sortedData = sortedData.sort((a, b) => customSortingAlg(a[key], b[key], direction));
      else
        switch (direction) {
          case "ascending":
            sortedData = sortedData.sort((a, b) => (a[key] > b[key] ? -1 : 1));
            break;
          case "descending":
            sortedData = sortedData.sort((a, b) => (a[key] < b[key] ? -1 : 1));
            break;
        }
    }
    return sortedData;
  };

  // Only valid if `filterDisplayStrategy` is `alternative`.
  const pipeAbstractSearch = (data?: DataType[], filters?: IAbstractInputCollection) => {
    if (!data || data.length === 0) return;
    let filteredData: DataType[] = [...data];
    if (filters) {
      for (const key in filters) {
        const equalityFilter = columns.find((x) => x.key === key)?.filteringProps?.alternate;
        filteredData = filteredData.filter((item) => {
          const assignedFilters = filters[key];
          if (!assignedFilters || (assignedFilters as any)?.length === 0 || (assignedFilters as any)?.size === 0)
            return true;
          switch (equalityFilter?.type) {
            case "select":
              if (equalityFilter.multipleSelection) {
                for (const f of (filters?.[key] as Set<string>)?.keys()) {
                  if (
                    (equalityFilter.equalityComparer && equalityFilter.equalityComparer?.(item[key], f)) ||
                    (!equalityFilter.equalityComparer && f?.toLowerCase() === `${item[key]}`?.toLowerCase())
                  )
                    return true;
                }
                return false;
              }
              return `${item[key]}`?.toLowerCase() === `${filters[key]}`.toLowerCase();
            default:
              if (equalityFilter?.equalityComparer) {
                return equalityFilter.equalityComparer(assignedFilters as string, item[key]);
              }
              return `${item[key]}`?.toLowerCase().includes(`${filters[key]}`.toLowerCase());
          }
        });
      }
    }
    return filteredData;
  };

  // Only valid if `filterDisplayStrategy` is `default`.
  const pipeFilters = (data?: DataType[], filters?: ISelectedFilter) => {
    if (!data || data.length === 0) return;
    let filteredData: DataType[] = [...data];
    if (filters) {
      function assignFilter(item: DataType, key: string) {
        const equalityComparer = columns.find((x) => x.key === key)?.filteringProps?.default?.equalityComparer;
        const currentItemFilters = filters![key];
        // If filter array contains no items, stop execution.
        if (!currentItemFilters || currentItemFilters.size === 0) return true;

        // Convert object to string and compare.

        for (const f of currentItemFilters.keys()) {
          if (
            (equalityComparer && equalityComparer?.(item[key], f)) ||
            (!equalityComparer && f?.toLowerCase() === `${item[key]}`?.toLowerCase())
          )
            return true;
        }

        return false;
      }

      for (const key in filters) filteredData = filteredData.filter((item) => assignFilter(item, key));
    }
    return filteredData;
  };

  async function pipeFetchedFilters(
    key: string,
    asyncFetchCallback?: ((key: string, inputValue?: string | undefined) => Promise<string[]>) | undefined
  ) {
    if (!prefetchedFilters[key]) {
      console.log("entered");
      let mappedFilters: string[] | undefined;

      const column = columns.find((x) => x.key === key);

      if (column?.filteringProps?.default?.defaultFilters) {
        mappedFilters = column.filteringProps.default.defaultFilters;
      } else if (
        column?.filteringProps?.alternate?.type === "select" &&
        column?.filteringProps?.alternate?.defaultFilters
      ) {
        mappedFilters = column.filteringProps.alternate.defaultFilters;
      } else {
        if (asyncFetchCallback) {
          mappedFilters = await asyncFetchCallback?.(key);
        } else mappedFilters = data?.flatMap((x) => `${x[key]}`);
      }

      updatePrefetchedFilters(
        key,
        // Eliminate duplicate values.
        Array.from(new Set(mappedFilters))
      );
    }
  }

  const pipePagination = useCallback((data?: DataType[], pagination?: TablePaginationProps) => {
    return data?.slice(
      pagination?.pageSize! * (pagination?.currentPage! - 1),
      pagination?.pageSize! * pagination?.currentPage!
    );
  }, []);

  const filteredData = useMemo(() => {
    switch (filterDisplayStrategy) {
      case "alternative":
        return pipeAbstractSearch(data, abstractFilters);
      default:
        return pipeFilters(data, selectedFilters);
    }
  }, [data, selectedFilters, abstractFilters]);

  const sortedData = useMemo(() => pipeSorting(filteredData, currentSortFilter), [filteredData, currentSortFilter]);

  const [paginationProps, setPaginationProps] = useState<TablePaginationProps>({
    currentPage: PAGINATION_CURRENT_PAGE,
    dataCount: filteredData?.length,
    pageSize: PAGINATION_PAGE_SIZE,
  });

  function updateInputValue(key: string, value: string) {
    return new Promise<IFilterInputCollection>((res) =>
      setInputValue((prev) => {
        const updatedState = { ...prev, [key]: value };
        res(updatedState);
        return updatedState;
      })
    );
  }

  function updatePrefetchedFilters(key: string, value: string[]) {
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

  function updateSelectedFilters(key: string, value?: string | string[]) {
    let filtersToDisplay: ISelectedFilter;

    //Reset pagination's current page to one on filters' change
    if (paginationProps.currentPage !== 1) updatePaginationProps({ currentPage: 1 });

    if (!value) {
      filtersToDisplay = { ...selectedFilters, [key]: new Set() };
      setSelectedFilters(filtersToDisplay);
      return Promise.resolve(filtersToDisplay);
    }
    if (Array.isArray(value)) {
      filtersToDisplay = { ...selectedFilters, [key]: new Set(value) };
    } else {
      const prevFiltersOfSameKey = new Set(selectedFilters?.[key]);

      if (prevFiltersOfSameKey.has(value)) prevFiltersOfSameKey.delete(value);
      else prevFiltersOfSameKey.add(value);

      filtersToDisplay = {
        ...selectedFilters,
        [key]: prevFiltersOfSameKey,
      };
    }

    setSelectedFilters(filtersToDisplay);

    return Promise.resolve(filtersToDisplay);
  }

  function updateTextFilterValue(key: string, value: string | Set<string>) {
    return new Promise<IAbstractInputCollection>((res) => {
      setAbstractFilters((prev) => {
        const updatedState = { ...prev, [key]: value };
        res(updatedState);
        return updatedState;
      });
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
      setCurrentSortFilter(updatedState);
      return Promise.resolve(updatedState);
    }
    return new Promise<ISortingFilter>((res) => {
      setCurrentSortFilter((prev) => {
        let updatedState: ISortingFilter;
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
    if (currentSortFilter) {
      sortingProps?.onSortingChange?.(
        currentSortFilterRef.current!.key,
        currentSortFilterRef.current?.direction,
        sortedData!
      );
    }
  }, [currentSortFilter]);

  return {
    inputValue,
    currentSortFilter,
    abstractFilters,
    prefetchedFilters,
    selectedFilters,
    paginationProps,
    sortData,
    updateInputValue,
    pipeFetchedFilters,
    resetFetchedFilters,
    updateTextFilterValue,
    updateSelectedFilters,
    updatePaginationProps,
    updatePrefetchedFilters,
    data: pipePagination(sortedData, paginationProps),
    dataWithoutPagination: sortedData,
    progressReporters,
    setProgressReporters,
  };
}
