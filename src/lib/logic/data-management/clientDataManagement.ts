/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from "react";
import { StringExtensions } from "../../extensions/String";
import { ConstProps } from "../../static/constantProps";
import {
  ColumnDefinition,
  KeyLiteralType,
  DataGridPaginationProps,
  DataGridProps,
  InputCommonFiltering,
  InitialDataStateProps,
} from "../../types/DataGrid";
import {
  DataFetchingDefinition,
  ICurrentFilterCollection,
  IPrefetchedFilter,
  ICurrentSorting,
  SortDirectionDefinition,
  CompleteFilterFnDefinition,
  ICurrentFnCollection,
  BaseFilterFnDefinition,
  GridDataType,
  SelectFilterOptionType,
} from "../../types/Utils";
import { assignFilterFns } from "../../utils/AssignFilterFn";
import { RDTDateFilters } from "./dateFilterFns";
import { RDTFilters } from "./filterFns";

export interface IClientDataManagement<DataType extends GridDataType> {
  columns: Array<ColumnDefinition<DataType>>;
  data: Array<DataType> | undefined;
  paginationProps: DataGridProps<DataType>["pagination"];
  sortingProps: DataGridProps<DataType>["sorting"];
  dataCount?: number;
  clientEvaluationDisabled?: boolean | undefined;
  initialDataState: InitialDataStateProps | undefined;
}

export function useClientDataManagement<DataType extends GridDataType>({
  columns,
  data,
  paginationProps,
  dataCount,
  sortingProps,
  clientEvaluationDisabled,
  initialDataState,
}: IClientDataManagement<DataType>) {
  /** Collection of already fetched filters. */
  const [prefetchedFilters, setPrefetchedFilters] = useState<IPrefetchedFilter>({});
  /** Filters that are currently in use. */
  const [currentFilters, setCurrentFilters] = useState<ICurrentFilterCollection>(initialDataState?.filters ?? {});
  /** Filter functions that are currently in use. */
  const [currentFilterFns, setCurrentFilterFns] = useState<ICurrentFnCollection>(
    initialDataState?.filterFns ?? assignFilterFns(columns)
  );
  /** Sorting that is currently in use. */
  const [currentSorting, setCurrentSorting] = useState<ICurrentSorting | undefined>(initialDataState?.sortingProps);
  /** Data fetching indicators. */
  const [progressReporters, setProgressReporters] = useState<Set<DataFetchingDefinition>>(new Set());
  /** DataGrid key to reset filters. */
  const [filterResetKey, setFilterResetKey] = useState(0);
  /** Pagination props that are currently active. */
  const currentPagination = useRef<DataGridPaginationProps>(
    initialDataState?.paginationProps ?? {
      currentPage: paginationProps?.defaults?.defaultCurrentPage ?? ConstProps.defaultPaginationCurrentPage,
      dataCount: undefined,
      pageSize: paginationProps?.defaults?.defaultPageSize ?? ConstProps.defaultPaginationPageSize,
    }
  );

  const [, renderState] = useState(false);

  const forceRender = () => renderState((prev) => !prev);

  const pipeSorting = (data?: DataType[], filters?: ICurrentSorting) => {
    if (clientEvaluationDisabled) return data;
    if (!data || data.length === 0) return;
    let sortedData = [...data];

    if (filters) {
      const customSortingAlg = getColumn(filters.key)?.sortingProps?.sortingComparer;

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

  const pipeFilters = (filters: ICurrentFilterCollection, filterFns: ICurrentFnCollection, data?: DataType[]) => {
    if (clientEvaluationDisabled) return data;
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
          if (colFilterProps?.equalityComparer) reFilter((d) => colFilterProps.equalityComparer!(d[columnKey], currentColFilter));
          else {
            if (colFilterProps?.multipleSelection)
              reFilter((d) => RDTFilters.containsMultiple(d, columnKey, currentColFilter as string[]));
            else reFilter((d) => RDTFilters.equalsAlt(d, columnKey, currentColFilter as string));
          }
          break;
        default:
          if (colFilterProps?.equalityComparer)
            reFilter((d) =>
              colFilterProps.equalityComparer!(currentColFilter as string, d[columnKey], filterFns[columnKey] as any)
            );
          else {
            if (colFilterProps?.type === "date")
              reFilter((d) => RDTDateFilters[colFilterFn as BaseFilterFnDefinition]?.(d[columnKey], currentColFilter as any));
            else {
              if (colFilterFn === "fuzzy") dataToFilter = RDTFilters.fuzzy(dataToFilter, columnKey, currentColFilter as string);
              else reFilter((d) => RDTFilters[colFilterFn as BaseFilterFnDefinition](d, columnKey, currentColFilter as any));
            }
          }
          break;
      }
    }
    return dataToFilter;
  };

  async function pipeFetchedFilters(
    key: string,
    asyncFetchCallback?: ((key: string, inputSearchValues?: string | undefined) => Promise<SelectFilterOptionType[]>) | undefined
  ) {
    if (!prefetchedFilters[key] || prefetchedFilters[key].length < 1) {
      let mappedFilters: SelectFilterOptionType[] | undefined;

      const column = getColumn(key);

      if (column?.filteringProps?.type === "select" && column?.filteringProps?.defaultFilters) {
        mappedFilters = column.filteringProps.defaultFilters;
      } else {
        if (asyncFetchCallback) {
          mappedFilters = await asyncFetchCallback?.(key);
        } else mappedFilters = Array.from(new Set(data?.flatMap((it) => `${it[key]}`))).map((x) => ({ label: x, value: x }));
      }

      updatePrefetchedFilters(
        key,
        // Eliminate duplicate values.
        mappedFilters
      );
    }
  }

  const pipePagination = (data?: DataType[], pagination?: DataGridPaginationProps) => {
    if (clientEvaluationDisabled) return data;
    return data?.slice(pagination?.pageSize! * (pagination?.currentPage! - 1), pagination?.pageSize! * pagination?.currentPage!);
  };

  const filteredData = useMemo(
    () => pipeSorting(pipeFilters(currentFilters, currentFilterFns, data), currentSorting),
    [data, currentFilters, currentFilterFns, currentSorting]
  );

  function updatePrefetchedFilters(key: KeyLiteralType<DataType>, value: SelectFilterOptionType[]) {
    return new Promise<IPrefetchedFilter>((res) =>
      setPrefetchedFilters((prev) => {
        const updatedState = { ...prev, [key]: value };
        res(updatedState);
        return updatedState;
      })
    );
  }

  function updateCurrentPagination(valuesToUpdate: DataGridPaginationProps) {
    paginationProps?.onPaginationChange?.(valuesToUpdate);
    return new Promise<DataGridPaginationProps>((res) => {
      const updatedState = { ...currentPagination.current, ...valuesToUpdate };
      currentPagination.current = updatedState;
      forceRender();
      res(updatedState);
      return updatedState;
    });
  }

  function updateCurrentFilterFn(key: string, type: CompleteFilterFnDefinition) {
    if (isRangeFilterFn(type) && !isRangeFilterFn(currentFilterFns[key]))
      setCurrentFilters((prev) => ({ ...prev, [key]: [prev[key] as string] }));
    else if (!isRangeFilterFn(type) && isRangeFilterFn(currentFilterFns[key]))
      setCurrentFilters((prev) => ({ ...prev, [key]: prev[key]?.[0] }));

    if (ConstProps.defaultFnsNoFilter.includes(type) && currentFilters[key] === undefined)
      setCurrentFilters((prev) => ({ ...prev, [key]: StringExtensions.Empty }));

    resetPagination();
    return new Promise<ICurrentFnCollection>((res) => {
      setCurrentFilterFns((prev) => {
        const stateCopy = { ...prev, [key]: type };
        res(stateCopy);
        return stateCopy;
      });
    });
  }

  function updateCurrentFilterValue(key: string, value: string | Array<string>) {
    return new Promise<ICurrentFilterCollection>((res) => {
      resetPagination();
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

  function updateCurrentSorting(key: string, alg?: SortDirectionDefinition) {
    resetPagination();
    if (alg) {
      const updatedState = {
        key,
        direction: alg,
      };
      setCurrentSorting(updatedState);
      sortingProps?.onSortingChange?.(updatedState);
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
        sortingProps?.onSortingChange?.(updatedState);
        return updatedState;
      });
    });
  }

  function resetCurrentFilters() {
    return new Promise<ICurrentFilterCollection>((res) => {
      const emptyState = {};
      resetPagination();
      setCurrentFilters(emptyState);
      setFilterResetKey(Date.now());
      res(emptyState);
    });
  }

  function resetFetchedFilters(key?: string | undefined) {
    if (key) updatePrefetchedFilters(key, []);
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
    const defaultAssignedFn =
      colFilterFn.default ?? (colType === "date" ? ConstProps.defaultActiveDateFn : ConstProps.defaultActiveFn);
    return activeKey === colKey || defaultAssignedFn !== colFilterFn.current;
  }

  function isRangeFilterFn(fnsKey: CompleteFilterFnDefinition) {
    return ConstProps.defaultRangeFns.includes(fnsKey);
  }

  function hydrateSelectInputs() {
    columns.filter((x) => x.filteringProps?.type === "select").forEach((col) => pipeFetchedFilters(col.key as string));
  }

  const resetPagination = () => {
    let pagPropsToSet: DataGridPaginationProps = {
      ...currentPagination.current,
      currentPage: paginationProps?.defaults?.defaultCurrentPage ?? ConstProps.defaultPaginationCurrentPage,
    };
    currentPagination.current = pagPropsToSet;
    return pagPropsToSet;
  };

  useEffect(() => {
    if (initialDataState) hydrateSelectInputs();
  }, []);

  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      currentPagination.current = {
        ...currentPagination.current,
        dataCount: dataCount ?? filteredData.length,
      };
      forceRender();
    }
  }, [dataCount, filteredData]);

  const dataToExport = useMemo(
    () => pipePagination(filteredData, currentPagination.current) ?? [],
    [currentPagination.current, filteredData]
  );

  return {
    currentFilterFns,
    currentSorting,
    currentFilters,
    filterResetKey,
    prefetchedFilters,
    progressReporters,
    data: dataToExport,
    currentPagination: currentPagination.current,
    dataWithoutPagination: filteredData,
    getColumnType,
    isRangeFilterFn,
    isFilterFnActive,
    getColumn,
    getColumnFilterFn,
    getColumnFilterValue,
    hydrateSelectInputs,
    pipeFetchedFilters,
    resetCurrentFilters,
    resetFetchedFilters,
    resetPagination,
    setProgressReporters,
    updateCurrentSorting,
    updateCurrentFilterFn,
    updateCurrentPagination,
    updatePrefetchedFilters,
    updateCurrentFilterValue,
  };
}
