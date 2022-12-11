import { useEffect, useMemo, useRef } from "react";
import { TablePaginationProps, TableProps } from "../types/Table";
import {
  DataFetchingType,
  IAbstractInputCollection,
  IPrefetchedFilter,
  ISelectedFilter,
  ISortingFilter,
} from "../types/Utils";
import { IClientDataManagement, useClientDataManagement } from "./clientDataManagement";

export interface IServerDataManagement<DataType> extends IClientDataManagement<DataType> {
  serverSide?: TableProps<DataType>["serverSide"];
}

export function useServerDataManagement<DataType extends Record<string, any>>({
  columns,
  data,
  filterDisplayStrategy,
  dataCount,
  paginationDefaults,
  serverSide,
  sortingProps,
}: IServerDataManagement<DataType>) {
  /**
   * Indicates if data is being fetched.
   */

  const clientTools = useClientDataManagement({
    columns,
    data,
    filterDisplayStrategy,
    dataCount,
    paginationDefaults,
    sortingProps,
  });

  const selectedFilterRef = useRef<ISelectedFilter>({});
  const paginationPropsRef = useRef<TablePaginationProps>({});
  const currentSortfilterRef = useRef<ISortingFilter>();
  const prefetchedFilterRef = useRef<IPrefetchedFilter>({});
  const textFilterRef = useRef<IAbstractInputCollection>({});

  selectedFilterRef.current = clientTools.selectedFilters;
  paginationPropsRef.current = clientTools.paginationProps;
  currentSortfilterRef.current = clientTools.currentSortFilter;
  prefetchedFilterRef.current = clientTools.prefetchedFilters;
  textFilterRef.current = clientTools.abstractFilters;

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

  async function updateInputValue(key: string, value: string) {
    clientTools.updateInputValue(key, value).then(() => {
      if (serverSide?.defaultFiltering?.onFilterSearchAsync) {
        startFetching("filter-fetch");
        serverSide?.defaultFiltering?.onFilterSearchAsync?.(key, value).then((filters) => {
          clientTools.updatePrefetchedFilters(key, filters);
          stopFetching("filter-fetch");
        });
      }
    });
  }

  function updatePaginationProps(valuesToUpdate: TablePaginationProps) {
    clientTools.updatePaginationProps(valuesToUpdate).then((updatedPagination) => {
      if (serverSide?.pagination?.onChangeAsync) {
        startFetching("pagination");
        serverSide?.pagination
          ?.onChangeAsync(updatedPagination, selectedFilterRef.current)
          .then(() => stopFetching("pagination"));
      }
    });
  }

  function updateTextFilterValue(key: string, value: string | Set<string>) {
    clientTools.updateTextFilterValue(key, value).then((newState) => {
      if (serverSide?.alternativeFiltering?.onFilterSearchAsync) {
        startFetching("filter-select");
        serverSide?.alternativeFiltering
          ?.onFilterSearchAsync?.(newState, clientTools.paginationProps, currentSortfilterRef.current)
          .then(() => {
            stopFetching("filter-select");
          });
      }
    });
  }

  async function pipeFetchedFilters(key: string) {
    if (!clientTools.prefetchedFilters[key]) startFetching("filter-fetch");
    if (serverSide?.alternativeFiltering?.onDefaultFilterFetchAsync) {
      await clientTools.pipeFetchedFilters(key, serverSide?.alternativeFiltering?.onDefaultFilterFetchAsync);
    } else if (serverSide?.defaultFiltering?.onFilterSearchAsync) {
      await clientTools.pipeFetchedFilters(key, serverSide?.defaultFiltering?.onFilterSearchAsync);
    } else {
      await clientTools.pipeFetchedFilters(key);
    }
    stopFetching("filter-fetch");
  }

  const isFetching = useMemo(() => clientTools.progressReporters.size !== 0, [clientTools.progressReporters]);

  useEffect(() => {
    if (serverSide?.defaultFiltering?.onFilterSelectAsync && Object.keys(clientTools.selectedFilters).length > 0) {
      startFetching("filter-select");
      serverSide.defaultFiltering
        .onFilterSelectAsync(selectedFilterRef.current, paginationPropsRef.current, currentSortfilterRef.current)
        .then(() => stopFetching("filter-select"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientTools.selectedFilters]);

  useEffect(() => {
    if (serverSide?.sorting?.onSortingChangeAsync && currentSortfilterRef.current) {
      startFetching("sort");
      serverSide.sorting
        .onSortingChangeAsync(
          currentSortfilterRef.current.key,
          serverSide.alternativeFiltering ? textFilterRef.current : selectedFilterRef.current,
          paginationPropsRef.current,
          currentSortfilterRef.current.direction
        )
        .then(() => stopFetching("sort"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientTools.currentSortFilter]);

  return {
    ...clientTools,
    data,
    isFetching,
    updateInputValue,
    updatePaginationProps,
    updateTextFilterValue,
    pipeFetchedFilters,
  };
}
