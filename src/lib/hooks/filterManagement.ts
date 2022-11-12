import { useCallback, useEffect, useRef, useState } from "react";
import { ColumnType, TablePaginationProps, TableProps } from "../types/Table";
import {
  DataFetchingType,
  SelectedFilterType,
  FetchedFilterType,
  PaginationTableProps,
} from "../types/Utils";

export function useFilterManagement<DataType extends Record<string, any>>(
  columns: ColumnType<DataType>[],
  data?: DataType[],
  serverSide?: TableProps<DataType>["serverSide"],
  paginationDefaults?: PaginationTableProps["paginationDefaults"]
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
  const [fetchedFilters, setFetchedFilters] = useState<FetchedFilterType>(
    new Map()
  );

  /**
   * Collection of user selected filters.
   */
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilterType>(
    {}
  );

  // Refs are used in place of state when performing callbacks, as they keep the up-to-date value.
  const selectedFilterRef = useRef<SelectedFilterType>({});
  const fetchedFilterRef = useRef<FetchedFilterType>(new Map());
  const paginationPropsRef = useRef<TablePaginationProps>({});

  selectedFilterRef.current = selectedFilters;
  fetchedFilterRef.current = fetchedFilters;
  const [inputValue, setInputValue] = useState<{
    [key: string]: string | undefined;
  }>();

  const pipeFilters = useCallback(
    (data?: DataType[], filters?: SelectedFilterType) => {
      if (!data || data.length === 0) return;
      let filteredData: DataType[] = [...data];
      if (filters) {
        for (const key in filters) {
          filteredData = filteredData.filter((item) => {
            const currentItemFilters = filters?.[key];
            // If filter array contains no items, stop execution.
            if (currentItemFilters.size === 0) return true;

            // Convert object to string and compare.

            for (const f of currentItemFilters.keys()) {
              if (f?.toLowerCase() === `${item[key]}`?.toLowerCase())
                return true;
            }
            return false;
          });
        }
      }
      return filteredData;
    },
    [data, selectedFilters]
  );

  const filteredData = serverSide?.filters?.onFilterSelect
    ? data
    : pipeFilters(data, selectedFilters);

  const [paginationProps, setPaginationProps] = useState<TablePaginationProps>({
    currentPage: PAGINATION_CURRENT_PAGE,
    dataCount: serverSide?.pagination?.dataCount ?? filteredData?.length,
    pageSize: PAGINATION_PAGE_SIZE,
  });
  paginationPropsRef.current = paginationProps;

  async function updateInputValue(key?: string, value?: string) {
    if (key) {
      setInputValue((prev) => ({ ...prev, [key]: value }));
      if (serverSide?.filters?.onFilterSearch) {
        startFetching("filter-fetch");
        const filters = await serverSide?.filters?.onFilterSearch?.(key, value);
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
    if (paginationPropsRef.current.currentPage !== 1)
      updatePaginationProps({ currentPage: 1 }, false);

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
      const columnFilterType = column?.filter;

      if (column?.defaultFilters) {
        mappedFilters = column.defaultFilters;
      } else {
        if (serverSide?.filters?.onFilterSearch) {
          startFetching("filter-fetch");
          mappedFilters = await serverSide?.filters?.onFilterSearch?.(key);
          stopFetching("filter-fetch");
        } else {
          mappedFilters = data?.flatMap((x) => `${x[key]}`);
        }
      }

      if (columnFilterType && typeof columnFilterType === "function")
        mappedFilters = mappedFilters?.map(columnFilterType);

      // Eliminate duplicate values.
      updateFetchedFilters(key, Array.from(new Set(mappedFilters)));
    }
  }

  function resetFetchedFilters(key?: string | undefined) {
    if (key) updateFetchedFilters(key, []);
  }

  function updatePaginationProps(
    valuesToUpdate: TablePaginationProps,
    shouldTriggerServerUpdate: boolean = true
  ) {
    setPaginationProps((prev) => {
      const updatedPagination = { ...prev, ...valuesToUpdate };
      if (shouldTriggerServerUpdate && serverSide?.pagination?.onChange) {
        startFetching("pagination");
        serverSide?.pagination
          ?.onChange(updatedPagination, selectedFilterRef.current)
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

  useEffect(() => {
    if (filteredData && filteredData.length > 0)
      setPaginationProps((prev) => ({
        ...prev,
        dataCount: serverSide?.pagination?.dataCount ?? filteredData.length,
      }));
  }, [data, fetchedFilters, selectedFilters]);

  useEffect(() => {
    if (
      serverSide?.filters?.onFilterSelect &&
      Object.keys(selectedFilters).length > 0
    ) {
      startFetching("filter-select");
      serverSide?.filters
        ?.onFilterSelect?.(
          selectedFilterRef.current,
          paginationPropsRef.current
        )
        .then(() => stopFetching("filter-select"));
    }
  }, [selectedFilters]);

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
    data: pipePagination(filteredData, paginationProps),
  };
}
