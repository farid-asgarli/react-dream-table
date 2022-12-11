import React, { useMemo } from "react";
import { useTableContext } from "../../../../context/TableContext";
import { DataFetchingType } from "../../../../types/Utils";
import Input from "../../Input/Input";
import { Select } from "../../Select/Select";

export default function AlternativeFilterMenu({
  filterInputProps,
  columnKey,
  progressReporters,
}: {
  columnKey: string;
  progressReporters: Set<DataFetchingType>;
  filterInputProps?: {
    handleChangeFilterInput?: (key: string, value: string | Set<string>) => void;
    currentValue?: string | Set<string>;
    fetchFilters?: (key: string) => Promise<void>;
    prefetchedFilters?: Record<string, string[]>;
    type?: "select" | "input";
    render?: (text: string) => React.ReactNode;
    multiple?: boolean | undefined;
    searchInputProps?: ((key: string) => React.InputHTMLAttributes<HTMLInputElement>) | undefined;
    renderCustomInput?: (handleChange: (key: string, value: any | Set<any>) => void, value: any) => React.ReactNode;
  };
}) {
  const { localization } = useTableContext();

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    filterInputProps?.handleChangeFilterInput?.(columnKey, e.target.value);
  }
  const renderOptions = useMemo(() => {
    if (filterInputProps?.render) {
      return filterInputProps?.prefetchedFilters?.[columnKey]?.map((x) => ({
        children: filterInputProps.render?.(x),
        value: x,
      }));
    }
    return filterInputProps?.prefetchedFilters?.[columnKey]?.map((x) => ({
      children: x,
      value: x,
    }));
  }, [columnKey, filterInputProps]);
  return (
    <>
      {filterInputProps?.renderCustomInput ? (
        filterInputProps.renderCustomInput(filterInputProps?.handleChangeFilterInput!, filterInputProps.currentValue)
      ) : filterInputProps?.type === "select" ? (
        <Select
          loading={progressReporters.has("filter-fetch")}
          value={(filterInputProps?.currentValue as any) ?? new Set()}
          multiple={filterInputProps.multiple}
          options={renderOptions ?? []}
          clearable
          onChange={(val: any) => filterInputProps?.handleChangeFilterInput?.(columnKey, val)}
          onOpen={() => filterInputProps?.fetchFilters?.(columnKey)}
        />
      ) : (
        <Input
          placeholder={localization.alternativeFilterSearchPlaceholder}
          {...filterInputProps?.searchInputProps?.(columnKey)}
          onChange={handleInputChange}
        />
      )}
    </>
  );
}
