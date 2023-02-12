import { useMemo } from "react";
import { DataGridPaginationProps, DataGridProps } from "../../types/DataGrid";
import { CompleteFilterFnDefinition, DataFetchingDefinition, GridDataType, SortDirectionDefinition } from "../../types/Utils";
import { IClientDataManagement, useClientDataManagement } from "./clientDataManagement";

export interface IServerDataManagement<DataType extends GridDataType> extends IClientDataManagement<DataType> {
  serverSide?: DataGridProps<DataType>["serverSide"];
}

export function useServerDataManagement<DataType extends GridDataType>({
  columns,
  data,
  dataCount,
  paginationProps,
  serverSide,
  sortingProps,
}: IServerDataManagement<DataType>) {
  const clientTools = useClientDataManagement({
    columns,
    data,
    dataCount,
    paginationProps,
    sortingProps,
    clientEvaluationDisabled: true,
  });

  function startFetching(value: DataFetchingDefinition) {
    clientTools.setProgressReporters((prev) => new Set(prev).add(value));
  }

  function stopFetching(value: DataFetchingDefinition) {
    clientTools.setProgressReporters((prev) => {
      const stateCopy = new Set(prev);
      stateCopy.delete(value);
      return stateCopy;
    });
  }

  function updateCurrentFilterValue(key: string, value: string | Array<string>) {
    clientTools.updateCurrentFilterValue(key, value).then((updatedFilters) => {
      if (serverSide?.filtering?.onFilterChangeAsync) {
        startFetching("filter-select");
        serverSide.filtering
          .onFilterChangeAsync(updatedFilters, clientTools.currentFilterFns, clientTools.currentPagination, clientTools.currentSorting)
          .then(() => stopFetching("filter-select"));
      }
    });
  }

  function updateCurrentFilterFn(key: string, type: CompleteFilterFnDefinition) {
    clientTools.updateCurrentFilterFn(key, type).then((updatedFilterFn) => {
      if (serverSide?.filtering.onFilterFunctionChangeAsync) {
        startFetching("filter-select");
        serverSide.filtering
          .onFilterFunctionChangeAsync(
            clientTools.currentFilters,
            updatedFilterFn,
            clientTools.currentPagination,
            clientTools.currentSorting
          )
          .then(() => stopFetching("filter-select"));
      }
    });
  }

  function updateCurrentPagination(valuesToUpdate: DataGridPaginationProps) {
    clientTools.updateCurrentPagination(valuesToUpdate).then((updatedPagination) => {
      if (serverSide?.pagination?.onChangeAsync) {
        startFetching("pagination");
        serverSide?.pagination
          ?.onChangeAsync(clientTools.currentFilters, clientTools.currentFilterFns, updatedPagination, clientTools.currentSorting)
          .then(() => stopFetching("pagination"));
      }
    });
  }

  function updateCurrentSorting(key: string, alg?: SortDirectionDefinition) {
    clientTools.updateCurrentSorting(key, alg).then((updatedSorting) => {
      if (serverSide?.filtering.onFilterFunctionChangeAsync) {
        startFetching("sort");
        serverSide.filtering
          .onFilterFunctionChangeAsync(
            clientTools.currentFilters,
            clientTools.currentFilterFns,
            clientTools.currentPagination,
            updatedSorting
          )
          .then(() => stopFetching("sort"));
      }
    });
  }

  function resetCurrentFilters() {
    clientTools.resetCurrentFilters().then((updatedState) => {
      if (serverSide?.filtering?.onFilterChangeAsync) {
        startFetching("filter-select");
        serverSide.filtering
          .onFilterChangeAsync?.(updatedState, clientTools.currentFilterFns, clientTools.currentPagination, clientTools.currentSorting)
          .then(() => stopFetching("filter-select"));
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

  return {
    ...clientTools,
    data,
    isFetching,
    paginationProps: { ...clientTools.currentPagination, dataCount: serverSide?.pagination?.dataCount },
    updateCurrentPagination,
    updateCurrentFilterValue,
    pipeFetchedFilters,
    resetCurrentFilters,
    updateCurrentFilterFn,
    updateCurrentSorting,
  };
}
