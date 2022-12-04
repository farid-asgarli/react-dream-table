/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ColumnType, TablePaginationProps, TableProps } from "../types/Table";
import {
  DataFetchingType,
  SelectedFilterType,
  FetchedFilterType,
  PaginationTableProps,
  SortFilterType,
  SortDirectionType,
} from "../types/Utils";

export function useFilterManagement<DataType extends Record<string, any>>(
  columns: ColumnType<DataType>[],
  data?: DataType[],
  serverSide?: TableProps<DataType>["serverSide"],
  paginationDefaults?: PaginationTableProps["paginationDefaults"],
  sortingProps?: TableProps<DataType>["sorting"]
) {
  const PAGINATION_CURRENT_PAGE = paginationDefaults?.defaultCurrentPage ?? 1;
  const PAGINATION_PAGE_SIZE = paginationDefaults?.defaultPageSize ?? 10;

  /**
   * Indicates if data is being fetched.
   */
  const [fetching, setFetching] = useState<Set<DataFetchingType>>(new Set());

  /**
   * Collection of already fetched filters.
   */
  const [fetchedFilters, setFetchedFilters] = useState<FetchedFilterType>(new Map());

  /**
   * Collection of user selected filters.
   */
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilterType>({});

  const [sortFilter, setSortFilter] = useState<SortFilterType>();

  // Refs are used in place of state when performing callbacks, as they keep the up-to-date value.
  const selectedFilterRef = useRef<SelectedFilterType>({});
  const fetchedFilterRef = useRef<FetchedFilterType>(new Map());
  const paginationPropsRef = useRef<TablePaginationProps>({});
  const sortFilterRef = useRef<SortFilterType>();

  selectedFilterRef.current = selectedFilters;
  fetchedFilterRef.current = fetchedFilters;
  sortFilterRef.current = sortFilter;

  const [inputValue, setInputValue] = useState<{
    [key: string]: string | undefined;
  }>();

  const pipeSorting = useCallback(
    (data?: DataType[], filters?: SortFilterType) => {
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
    },
    [data, sortFilter]
  );

  const pipeFilters = useCallback(
    (data?: DataType[], filters?: SelectedFilterType) => {
      if (!data || data.length === 0) return;
      let filteredData: DataType[] = [...data];
      if (filters) {
        const assignFilter = (item: DataType, key: string) => {
          const equalityComparer = columns.find((x) => x.key === key)?.filteringProps?.equalityComparer;
          const currentItemFilters = filters?.[key];
          // If filter array contains no items, stop execution.
          if (currentItemFilters.size === 0) return true;

          // Convert object to string and compare.

          for (const f of currentItemFilters.keys()) {
            if (
              (equalityComparer && equalityComparer?.(item[key], f)) ||
              (!equalityComparer && f?.toLowerCase() === `${item[key]}`?.toLowerCase())
            )
              return true;
          }
          return false;
        };

        for (const key in filters) {
          filteredData = filteredData.filter((item) => assignFilter(item, key));
        }
      }
      return filteredData;
    },
    [data, selectedFilters]
  );

  const filteredData = useMemo(
    () => (serverSide?.filters?.onFilterSelectAsync ? data : pipeFilters(data, selectedFilters)),
    [data, selectedFilters]
  );

  const sortedData = useMemo(
    () => (serverSide?.sorting?.onSortingChangeAsync ? filteredData : pipeSorting(filteredData, sortFilterRef.current)),
    [filteredData, sortFilter]
  );

  const [paginationProps, setPaginationProps] = useState<TablePaginationProps>({
    currentPage: PAGINATION_CURRENT_PAGE,
    dataCount: serverSide?.pagination?.dataCount ?? filteredData?.length,
    pageSize: PAGINATION_PAGE_SIZE,
  });
  paginationPropsRef.current = paginationProps;

  async function updateInputValue(key?: string, value?: string) {
    if (key) {
      setInputValue((prev) => ({ ...prev, [key]: value }));
      if (serverSide?.filters?.onFilterSearchAsync) {
        startFetching("filter-fetch");
        const filters = await serverSide?.filters?.onFilterSearchAsync?.(key, value);
        updateFetchedFilters(key, filters);
        stopFetching("filter-fetch");
      }
    }
  }

  function updateFetchedFilters(key: string, value: string[]) {
    setFetchedFilters((prev) => new Map(prev).set(key, value));
  }

  async function updateSelectedFilters(key: string, value?: string | string[]) {
    let filtersToDisplay: SelectedFilterType;

    //Reset pagination's current page to one on filters' change
    if (paginationPropsRef.current.currentPage !== 1) updatePaginationProps({ currentPage: 1 }, false);

    setSelectedFilters((prev) => {
      if (!value) {
        filtersToDisplay = { ...prev, [key]: new Set() };
        return filtersToDisplay;
      }

      if (Array.isArray(value)) {
        filtersToDisplay = { ...prev, [key]: new Set(value) };
      } else {
        const prevFiltersOfSameKey = new Set(prev[key]);

        if (prevFiltersOfSameKey.has(value)) prevFiltersOfSameKey.delete(value);
        else prevFiltersOfSameKey.add(value);

        filtersToDisplay = {
          ...prev,
          [key]: prevFiltersOfSameKey,
        };
      }

      return filtersToDisplay;
    });
  }

  const pipePagination = useCallback(
    (data?: DataType[], pagination?: TablePaginationProps) => {
      return serverSide?.pagination
        ? data
        : data?.slice(
            pagination?.pageSize! * (pagination?.currentPage! - 1),
            pagination?.pageSize! * pagination?.currentPage!
          );
    },
    [data, paginationProps]
  );

  async function pipeFetchedFilters(key: string) {
    if (!fetchedFilterRef.current.has(key)) {
      let mappedFilters: string[] | undefined;

      const column = columns.find((x) => x.key === key);

      if (column?.filteringProps?.defaultFilters) {
        mappedFilters = column.filteringProps?.defaultFilters;
      } else {
        if (serverSide?.filters?.onFilterSearchAsync) {
          startFetching("filter-fetch");
          mappedFilters = await serverSide?.filters?.onFilterSearchAsync?.(key);
          stopFetching("filter-fetch");
        } else {
          mappedFilters = data?.flatMap((x) => `${x[key]}`);
        }
      }

      // Eliminate duplicate values.
      updateFetchedFilters(key, Array.from(new Set(mappedFilters)));
    }
  }

  function resetFetchedFilters(key?: string | undefined) {
    if (key) updateFetchedFilters(key, []);
  }

  function updatePaginationProps(valuesToUpdate: TablePaginationProps, shouldTriggerServerUpdate: boolean = true) {
    setPaginationProps((prev) => {
      const updatedPagination = { ...prev, ...valuesToUpdate };
      if (shouldTriggerServerUpdate && serverSide?.pagination?.onChangeAsync) {
        startFetching("pagination");
        serverSide?.pagination
          ?.onChangeAsync(updatedPagination, selectedFilterRef.current)
          .then(() => stopFetching("pagination"));
      }
      return updatedPagination;
    });
  }

  function startFetching(value: DataFetchingType) {
    setFetching((prev) => new Set(prev).add(value));
  }

  function stopFetching(value: DataFetchingType) {
    setFetching((prev) => {
      const stateCopy = new Set(prev);
      stateCopy.delete(value);
      return stateCopy;
    });
  }

  function sortData(key: string, alg?: SortDirectionType) {
    if (alg) {
      setSortFilter({
        key,
        direction: alg,
      });
      return;
    }
    setSortFilter((prev) => {
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

        return {
          key,
          direction: sortType,
        };
      }

      return {
        key,
        direction: "ascending",
      };
    });
  }

  useEffect(() => {
    if (filteredData && filteredData.length > 0)
      setPaginationProps((prev) => ({
        ...prev,
        dataCount: serverSide?.pagination?.dataCount ?? filteredData.length,
      }));
  }, [data, fetchedFilters, selectedFilters]);

  useEffect(() => {
    if (serverSide?.filters?.onFilterSelectAsync && Object.keys(selectedFilters).length > 0) {
      startFetching("filter-select");
      serverSide.filters
        .onFilterSelectAsync(selectedFilterRef.current, paginationPropsRef.current)
        .then(() => stopFetching("filter-select"));
    }
  }, [selectedFilters]);

  useEffect(() => {
    if (sortFilterRef.current) {
      sortingProps?.onSortingChange?.(sortFilterRef.current?.key, sortFilterRef.current?.direction, sortedData!);
    }
    if (serverSide?.sorting?.onSortingChangeAsync && sortFilterRef.current) {
      startFetching("sort");
      serverSide.sorting
        .onSortingChangeAsync(sortFilterRef.current.key, sortFilterRef.current.direction)
        .then(() => stopFetching("sort"));
    }
  }, [sortFilter]);

  return {
    fetchedFilters,
    selectedFilters,
    inputValue,
    updateInputValue,
    updateSelectedFilters,
    paginationProps,
    updatePaginationProps,
    pipeFetchedFilters,
    resetFetchedFilters,
    fetching,
    data: pipePagination(sortedData, paginationProps),
    sortData,
    sortFilter,
  };
}
