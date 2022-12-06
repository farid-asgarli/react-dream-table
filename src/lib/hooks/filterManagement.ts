/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ColumnType, FilterDisplayStrategy, TablePaginationProps, TableProps } from "../types/Table";
import {
  SelectedFilterType,
  FetchedFilterType,
  PaginationContainerProps,
  SortFilterType,
  SortDirectionType,
  DataFetchingType,
} from "../types/Utils";

export function useFilterManagement<DataType extends Record<string, any>>(
  columns: ColumnType<DataType>[],
  data?: DataType[],
  serverSide?: TableProps<DataType>["serverSide"],
  paginationDefaults?: PaginationContainerProps["paginationDefaults"],
  sortingProps?: TableProps<DataType>["sorting"],
  filterDisplayStrategy?: FilterDisplayStrategy | undefined
) {
  const PAGINATION_CURRENT_PAGE = paginationDefaults?.defaultCurrentPage ?? 1;
  const PAGINATION_PAGE_SIZE = paginationDefaults?.defaultPageSize ?? 10;

  /**
   * Indicates if data is being fetched.
   */
  const [progressReporters, setProgressReporters] = useState<Set<DataFetchingType>>(new Set());

  /**
   * Collection of already fetched filters.
   */
  const [fetchedFilters, setFetchedFilters] = useState<FetchedFilterType>(new Map());

  /**
   * Collection of user selected filters.
   */
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilterType>({});

  /** Sorting that is currently in use. */
  const [sortFilter, setSortFilter] = useState<SortFilterType>();

  /** Search input value in filter menu. */
  const [inputValue, setInputValue] = useState<Record<string, string | undefined>>();

  const [textFilters, setTextFilters] = useState<Record<string, string | undefined>>({});

  // Refs are used in place of state when performing callbacks, as they hold the up-to-date value.
  const selectedFilterRef = useRef<SelectedFilterType>({});
  const fetchedFilterRef = useRef<FetchedFilterType>(new Map());
  const paginationPropsRef = useRef<TablePaginationProps>({});
  const sortFilterRef = useRef<SortFilterType>();
  const textFilterRef = useRef<Record<string, string | undefined>>({});

  selectedFilterRef.current = selectedFilters;
  fetchedFilterRef.current = fetchedFilters;
  sortFilterRef.current = sortFilter;
  textFilterRef.current = textFilters;

  const pipeSorting = (data?: DataType[], filters?: SortFilterType) => {
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
  const pipeSearchInputText = (data?: DataType[], filters?: typeof textFilters) => {
    if (!data || data.length === 0) return;
    let filteredData: DataType[] = [...data];
    if (filters) {
      for (const key in filters) {
        const equalityFilter = columns.find((x) => x.key === key)?.filteringProps?.alternate?.equalityComparer;
        filteredData = filteredData.filter((item) => {
          if (!filters[key] || filters[key]?.length === 0) return true;
          else if (equalityFilter) return equalityFilter(filters[key], item[key]);
          return `${item[key]}`?.toLowerCase().includes(`${filters[key]}`.toLowerCase());
        });
      }
    }
    return filteredData;
  };

  // Only valid if `filterDisplayStrategy` is `default`.
  const pipeFilters = (data?: DataType[], filters?: SelectedFilterType) => {
    if (!data || data.length === 0) return;
    let filteredData: DataType[] = [...data];
    if (filters) {
      const assignFilter = (item: DataType, key: string) => {
        const equalityComparer = columns.find((x) => x.key === key)?.filteringProps?.default?.equalityComparer;
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
  };

  const filteredData = useMemo(() => {
    if (serverSide?.defaultFiltering?.onFilterSelectAsync) return data;
    else if (filterDisplayStrategy !== "alternative") return pipeFilters(data, selectedFilters);
    return pipeSearchInputText(data, textFilters);
  }, [data, selectedFilters, textFilters]);

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
      if (serverSide?.defaultFiltering?.onFilterSearchAsync) {
        startFetching("filter-fetch");
        const filters = await serverSide?.defaultFiltering?.onFilterSearchAsync?.(key, value);
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

    if (!value) {
      filtersToDisplay = { ...selectedFilters, [key]: new Set() };
      setSelectedFilters(filtersToDisplay);
      return;
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
  }

  const pipePagination = useCallback((data?: DataType[], pagination?: TablePaginationProps) => {
    return serverSide?.pagination
      ? data
      : data?.slice(
          pagination?.pageSize! * (pagination?.currentPage! - 1),
          pagination?.pageSize! * pagination?.currentPage!
        );
  }, []);

  async function pipeFetchedFilters(key: string) {
    if (!fetchedFilterRef.current.has(key)) {
      let mappedFilters: string[] | undefined;

      const column = columns.find((x) => x.key === key);

      if (column?.filteringProps?.default?.defaultFilters) {
        mappedFilters = column.filteringProps.default.defaultFilters;
      } else {
        if (serverSide?.defaultFiltering?.onFilterSearchAsync) {
          startFetching("filter-fetch");
          mappedFilters = await serverSide?.defaultFiltering?.onFilterSearchAsync?.(key);
          stopFetching("filter-fetch");
        } else {
          mappedFilters = data?.flatMap((x) => `${x[key]}`);
        }
      }

      // Eliminate duplicate values.
      updateFetchedFilters(key, Array.from(new Set(mappedFilters)));
    }
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
    setProgressReporters((prev) => new Set(prev).add(value));
  }

  function stopFetching(value: DataFetchingType) {
    setProgressReporters((prev) => {
      const stateCopy = new Set(prev);
      stateCopy.delete(value);
      return stateCopy;
    });
  }

  async function updateTextFilterValue(key: string, value: string) {
    setTextFilters((prev) => {
      const newState = { ...prev, [key]: value };

      if (serverSide?.alternativeFiltering?.onFilterSearchAsync) {
        startFetching("filter-select");
        serverSide?.alternativeFiltering
          ?.onFilterSearchAsync?.(newState, paginationProps, sortFilterRef.current)
          .then(() => {
            stopFetching("filter-select");
          });
      }

      return newState;
    });
  }

  function resetFetchedFilters(key?: string | undefined) {
    if (key) updateFetchedFilters(key, []);
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

  const isFetching = useMemo(() => progressReporters.size !== 0, [progressReporters]);

  useEffect(() => {
    if (filteredData && filteredData.length > 0)
      setPaginationProps((prev) => ({
        ...prev,
        dataCount: serverSide?.pagination?.dataCount ?? filteredData.length,
      }));
  }, [data, fetchedFilters, selectedFilters]);

  useEffect(() => {
    if (serverSide?.defaultFiltering?.onFilterSelectAsync && Object.keys(selectedFilters).length > 0) {
      startFetching("filter-select");
      serverSide.defaultFiltering
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
    isFetching,
    inputValue,
    sortFilter,
    textFilters,
    fetchedFilters,
    selectedFilters,
    paginationProps,
    progressReporters,
    sortData,
    updateInputValue,
    pipeFetchedFilters,
    resetFetchedFilters,
    updateTextFilterValue,
    updateSelectedFilters,
    updatePaginationProps,
    data: pipePagination(sortedData, paginationProps),
    dataWithoutPagination: sortedData,
  };
}
