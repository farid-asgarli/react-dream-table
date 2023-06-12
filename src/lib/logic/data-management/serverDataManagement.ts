/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from "react";
import { DataGridPaginationProps, ServerSideFetchingProps } from "../../types/DataGrid";
import { CompleteFilterFnDefinition, DataFetchingDefinition, GridDataType, SortDirectionDefinition } from "../../types/Utils";
import { IClientDataManagement, useClientDataManagement } from "./clientDataManagement";

export interface IServerDataManagement<DataType extends GridDataType> extends IClientDataManagement<DataType> {
  serverSide?: ServerSideFetchingProps;
}

export function useServerDataManagement<DataType extends GridDataType>({
  columns,
  data,
  dataCount,
  paginationProps,
  serverSide,
  sortingProps,
  initialDataState,
}: IServerDataManagement<DataType>) {
  const clientTools = useClientDataManagement({
    columns,
    data,
    dataCount,
    paginationProps,
    sortingProps,
    clientEvaluationDisabled: true,
    initialDataState,
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

  async function updateCurrentFilterValue(key: string, value: string | Array<string>) {
    const updatedFilters = await clientTools.updateCurrentFilterValue(key, value);

    if (serverSide?.filtering?.onFilterChangeAsync || serverSide?.onGlobalChangeAsync) startFetching("filter-select");

    const currentPagination = clientTools.resetPagination();

    await serverSide?.filtering?.onFilterChangeAsync?.(
      updatedFilters,
      clientTools.currentFilterFns,
      currentPagination,
      clientTools.currentSorting
    );
    await serverSide?.onGlobalChangeAsync?.(
      updatedFilters,
      clientTools.currentFilterFns,
      currentPagination,
      clientTools.currentSorting
    );

    stopFetching("filter-select");
    return updatedFilters;
  }

  async function updateCurrentFilterFn(key: string, type: CompleteFilterFnDefinition) {
    const updatedFilterFn = await clientTools.updateCurrentFilterFn(key, type);
    if (serverSide?.filtering.onFilterFunctionChangeAsync || serverSide?.onGlobalChangeAsync) startFetching("filter-select");

    const currentPagination = clientTools.resetPagination();

    await serverSide?.filtering?.onFilterFunctionChangeAsync?.(
      clientTools.currentFilters,
      updatedFilterFn,
      currentPagination,
      clientTools.currentSorting
    );
    await serverSide?.onGlobalChangeAsync?.(
      clientTools.currentFilters,
      updatedFilterFn,
      currentPagination,
      clientTools.currentSorting
    );

    stopFetching("filter-select");

    return updatedFilterFn;
  }

  async function updateCurrentPagination(valuesToUpdate: DataGridPaginationProps) {
    const updatedPagination = await clientTools.updateCurrentPagination(valuesToUpdate);

    if (serverSide?.pagination?.onChangeAsync || serverSide?.onGlobalChangeAsync) startFetching("pagination");

    await serverSide?.pagination?.onChangeAsync?.(
      clientTools.currentFilters,
      clientTools.currentFilterFns,
      updatedPagination,
      clientTools.currentSorting
    );
    await serverSide?.onGlobalChangeAsync?.(
      clientTools.currentFilters,
      clientTools.currentFilterFns,
      updatedPagination,
      clientTools.currentSorting
    );
    stopFetching("pagination");
    return updatedPagination;
  }

  async function updateCurrentSorting(key: string, alg?: SortDirectionDefinition) {
    const updatedSorting = await clientTools.updateCurrentSorting(key, alg);
    if (serverSide?.sorting?.onSortingChangeAsync || serverSide?.onGlobalChangeAsync) startFetching("sort");

    const currentPagination = clientTools.resetPagination();

    await serverSide?.sorting?.onSortingChangeAsync?.(
      clientTools.currentFilters,
      clientTools.currentFilterFns,
      currentPagination,
      updatedSorting
    );
    await serverSide?.onGlobalChangeAsync?.(
      clientTools.currentFilters,
      clientTools.currentFilterFns,
      currentPagination,
      updatedSorting
    );
    stopFetching("sort");
    return updatedSorting;
  }

  async function resetCurrentFilters() {
    const updatedFilters = await clientTools.resetCurrentFilters();
    if (serverSide?.filtering?.onFilterChangeAsync) startFetching("filter-select");

    const currentPagination = clientTools.resetPagination();

    await serverSide?.filtering.onFilterChangeAsync?.(
      updatedFilters,
      clientTools.currentFilterFns,
      currentPagination,
      clientTools.currentSorting
    );
    await serverSide?.onGlobalChangeAsync?.(
      updatedFilters,
      clientTools.currentFilterFns,
      currentPagination,
      clientTools.currentSorting
    );
    stopFetching("filter-select");
    return updatedFilters;
  }

  async function pipeFetchedFilters(key: string) {
    if (!clientTools.prefetchedFilters[key]) startFetching("filter-fetch");
    if (serverSide?.filtering?.onDefaultFilterFetchAsync)
      await clientTools.pipeFetchedFilters(key, serverSide?.filtering?.onDefaultFilterFetchAsync);
    else await clientTools.pipeFetchedFilters(key);

    stopFetching("filter-fetch");
  }

  const isFetching = useMemo(() => clientTools.progressReporters.size !== 0, [clientTools.progressReporters]);

  useEffect(() => {
    if (initialDataState) {
      startFetching("filter-select");
      serverSide
        ?.onGlobalChangeAsync?.(
          clientTools.currentFilters,
          clientTools.currentFilterFns,
          clientTools.currentPagination,
          clientTools.currentSorting
        )
        .then(clientTools.hydrateSelectInputs)
        .then(() => stopFetching("filter-select"));
    }
  }, []);

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
