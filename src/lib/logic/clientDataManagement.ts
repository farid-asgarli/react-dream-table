/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ColumnType, KeyLiteralType, TablePaginationProps, TableProps } from "../types/Table";
import {
  DataFetchingType,
  ICurrentFilterCollection,
  IFilterInputCollection,
  IPrefetchedFilter,
  ICurrentSorting,
  FooterProps,
  SortDirectionType,
} from "../types/Utils";

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
  const PAGINATION_CURRENT_PAGE = paginationDefaults?.defaultCurrentPage ?? 1;
  const PAGINATION_PAGE_SIZE = paginationDefaults?.defaultPageSize ?? 10;

  /** Collection of already fetched filters. */
  const [prefetchedFilters, setPrefetchedFilters] = useState<IPrefetchedFilter<DataType>>(
    {} as IPrefetchedFilter<DataType>
  );

  /** Search input value in filter menu. */
  const [inputValue, setInputValue] = useState<IFilterInputCollection<DataType>>(
    {} as IFilterInputCollection<DataType>
  );

  /** Filters that are currently in use. */
  const [currentFilters, setCurrentFilters] = useState<ICurrentFilterCollection<DataType>>(
    {} as ICurrentFilterCollection<DataType>
  );

  /** Sorting that is currently in use. */
  const [currentSorting, setCurrentSorting] = useState<ICurrentSorting<DataType> | undefined>(undefined);

  /** Data fetching indicators. */
  const [progressReporters, setProgressReporters] = useState<Set<DataFetchingType>>(new Set());

  /** Table key to reset filters. */
  const [filterResetKey, setFilterResetKey] = useState(0);

  const currentSortingRef = useRef<ICurrentSorting<DataType>>();
  currentSortingRef.current = currentSorting;

  const prefetchedFilterRef = useRef<IPrefetchedFilter<DataType>>({} as IPrefetchedFilter<DataType>);
  prefetchedFilterRef.current = prefetchedFilters;

  const pipeSorting = (data?: DataType[], filters?: ICurrentSorting<DataType>) => {
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

  // Only valid if `filterDisplayStrategy` is `alternative`.
  const pipeFilterSearch = (data?: DataType[], filters?: ICurrentFilterCollection<DataType>) => {
    if (!data || data.length === 0) return;
    let filteredData: DataType[] = [...data];
    if (filters) {
      for (const key in filters) {
        const equalityFilter = columns.find((x) => x.key === key)?.filteringProps;
        filteredData = filteredData.filter((item) => {
          const assignedFilters = filters[key];
          if (!assignedFilters || (assignedFilters as any)?.length === 0 || (assignedFilters as any)?.size === 0)
            return true;
          switch (equalityFilter?.type) {
            case "select":
              if (equalityFilter.multipleSelection) {
                for (const f of (filters?.[key] as Set<string>)?.keys()) {
                  if (
                    (equalityFilter.equalityComparer &&
                      equalityFilter.equalityComparer?.(item[key as keyof DataType], f)) ||
                    (!equalityFilter.equalityComparer &&
                      f?.toLowerCase() === `${item[key as keyof DataType]}`?.toLowerCase())
                  )
                    return true;
                }
                return false;
              }
              return `${item[key as keyof DataType]}`?.toLowerCase() === `${filters[key]}`.toLowerCase();
            default:
              if (equalityFilter?.equalityComparer) {
                return equalityFilter.equalityComparer(assignedFilters as string, item[key as keyof DataType]);
              }
              return `${item[key as keyof DataType]}`?.toLowerCase().includes(`${filters[key]}`.toLowerCase());
          }
        });
      }
    }
    return filteredData;
  };

  async function pipeFetchedFilters(
    key: KeyLiteralType<DataType>,
    asyncFetchCallback?:
      | ((key: KeyLiteralType<DataType>, inputValue?: string | undefined) => Promise<string[]>)
      | undefined
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

  const pipePagination = useCallback((data?: DataType[], pagination?: TablePaginationProps) => {
    return data?.slice(
      pagination?.pageSize! * (pagination?.currentPage! - 1),
      pagination?.pageSize! * pagination?.currentPage!
    );
  }, []);

  const filteredData = useMemo(() => pipeFilterSearch(data, currentFilters), [data, currentFilters]);

  const sortedData = useMemo(() => pipeSorting(filteredData, currentSorting), [filteredData, currentSorting]);

  const [paginationProps, setPaginationProps] = useState<TablePaginationProps>({
    currentPage: PAGINATION_CURRENT_PAGE,
    dataCount: filteredData?.length,
    pageSize: PAGINATION_PAGE_SIZE,
  });

  function updateInputValue(key: string, value: string) {
    return new Promise<IFilterInputCollection<DataType>>((res) =>
      setInputValue((prev) => {
        const updatedState = { ...prev, [key]: value };
        res(updatedState);
        return updatedState;
      })
    );
  }

  function updatePrefetchedFilters(key: KeyLiteralType<DataType>, value: string[]) {
    return new Promise<IPrefetchedFilter<DataType>>((res) =>
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

  function updateCurrentFilterValue(key: string, value: string | Set<string>) {
    return new Promise<ICurrentFilterCollection<DataType>>((res) => {
      setCurrentFilters((prev) => {
        const updatedState = { ...prev, [key]: value };
        res(updatedState);
        return updatedState;
      });
    });
  }

  function resetCurrentFilters() {
    return new Promise<ICurrentFilterCollection<DataType>>((res) => {
      const emptyState = {} as ICurrentFilterCollection<DataType>;
      setCurrentFilters(emptyState);
      setInputValue(emptyState as IFilterInputCollection<DataType>);
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
    return new Promise<ICurrentSorting<DataType>>((res) => {
      setCurrentSorting((prev) => {
        let updatedState: ICurrentSorting<DataType>;
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

  return {
    inputValue,
    currentSorting,
    currentFilters,
    prefetchedFilters,
    paginationProps,
    sortData,
    updateInputValue,
    pipeFetchedFilters,
    resetCurrentFilters,
    resetFetchedFilters,
    updateCurrentFilterValue,
    updatePaginationProps,
    updatePrefetchedFilters,
    data: pipePagination(sortedData, paginationProps),
    dataWithoutPagination: sortedData,
    progressReporters,
    setProgressReporters,
    setPaginationProps,
    filterResetKey,
  };
}
