import { useEffect, useMemo, useRef } from "react";
import { TablePaginationProps, TableProps } from "../../types/Table";
import { DataFetchingType, ICurrentFilterCollection, ICurrentSorting, IPrefetchedFilter } from "../../types/Utils";
import { IClientDataManagement, useClientDataManagement } from "./clientDataManagement";

export interface IServerDataManagement<DataType> extends IClientDataManagement<DataType> {
  serverSide?: TableProps<DataType>["serverSide"];
}

export function useServerDataManagement<DataType>({
  columns,
  data,
  dataCount,
  paginationDefaults,
  serverSide,
  sortingProps,
}: IServerDataManagement<DataType>) {
  const clientTools = useClientDataManagement({
    columns,
    data,
    dataCount,
    paginationDefaults,
    sortingProps,
  });

  const paginationPropsRef = useRef<TablePaginationProps>({});
  const currentSortingRef = useRef<ICurrentSorting>();
  const prefetchedFilterRef = useRef<IPrefetchedFilter>({});
  const currentFilterRef = useRef<ICurrentFilterCollection>({});

  paginationPropsRef.current = clientTools.paginationProps;
  currentSortingRef.current = clientTools.currentSorting;
  prefetchedFilterRef.current = clientTools.prefetchedFilters;
  currentFilterRef.current = clientTools.currentFilters;

  function startFetching(value: DataFetchingType) {
    clientTools.setProgressReporters((prev) => new Set(prev).add(value));
  }

  function stopFetching(value: DataFetchingType) {
    clientTools.setProgressReporters((prev) => {
      const stateCopy = new Set(prev);
      stateCopy.delete(value);
      return stateCopy;
    });
  }

  function updatePaginationProps(valuesToUpdate: TablePaginationProps) {
    clientTools.updatePaginationProps(valuesToUpdate).then((updatedPagination) => {
      if (serverSide?.pagination?.onChangeAsync) {
        startFetching("pagination");
        serverSide?.pagination
          ?.onChangeAsync(updatedPagination, currentFilterRef.current)
          .then(() => stopFetching("pagination"));
      }
    });
  }

  function updateCurrentFilterValue(key: string, value: string | Array<string>) {
    clientTools.updateCurrentFilterValue(key, value).then((newState) => {
      if (serverSide?.filtering?.onFilterSearchAsync) {
        startFetching("filter-select");
        serverSide?.filtering
          ?.onFilterSearchAsync?.(newState, clientTools.paginationProps, currentSortingRef.current)
          .then(() => {
            stopFetching("filter-select");
          });
      }
    });
  }

  function resetCurrentFilters() {
    clientTools.resetCurrentFilters().then((newState) => {
      if (serverSide?.filtering?.onFilterSearchAsync) {
        startFetching("filter-select");
        serverSide?.filtering
          ?.onFilterSearchAsync?.(newState, clientTools.paginationProps, currentSortingRef.current)
          .then(() => {
            stopFetching("filter-select");
          });
      }
    });
  }

  async function pipeFetchedFilters(key: string) {
    if (!clientTools.prefetchedFilters[key]) startFetching("filter-fetch");
    if (serverSide?.filtering?.onDefaultFilterFetchAsync) {
      await clientTools.pipeFetchedFilters(key, serverSide?.filtering?.onDefaultFilterFetchAsync);
    } else {
      await clientTools.pipeFetchedFilters(key);
    }
    stopFetching("filter-fetch");
  }

  const isFetching = useMemo(() => clientTools.progressReporters.size !== 0, [clientTools.progressReporters]);

  useEffect(() => {
    if (serverSide?.sorting?.onSortingChangeAsync && currentSortingRef.current) {
      startFetching("sort");
      serverSide.sorting
        .onSortingChangeAsync(
          currentSortingRef.current.key,
          currentFilterRef.current,
          paginationPropsRef.current,
          currentSortingRef.current.direction
        )
        .then(() => stopFetching("sort"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientTools.currentSorting]);

  return {
    ...clientTools,
    data,
    isFetching,
    paginationProps: { ...clientTools.paginationProps, dataCount: serverSide?.pagination?.dataCount },
    updatePaginationProps,
    updateCurrentFilterValue,
    pipeFetchedFilters,
    resetCurrentFilters,
  };
}
