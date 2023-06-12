import { DataGridLocalizationDefinition, InputCommonFiltering } from "../../../types/DataGrid";
import { CompleteFilterFnDefinition, DataTools, GridDataType } from "../../../types/Utils";

export const renderFilterFnsActionsMenu = <DataType extends GridDataType>(
  key: string,
  hideMenu: () => void,
  dataTools: DataTools<DataType>,
  localization: DataGridLocalizationDefinition
) => {
  const activeColFilterFn = dataTools.getColumnFilterFn(key).current;
  const currentColumn = dataTools.getColumn(key);
  const columnType = currentColumn?.filteringProps?.type;

  let baseFns = [
    {
      key: "equals",
      symbol: "=",
      label: localization.filterEquals,
    },
    {
      key: "notEquals",
      symbol: "≠",
      label: localization.filterNotEquals,
    },
    {},
    {
      key: "between",
      symbol: "⇿",
      label: localization.filterBetween,
    },
    {
      key: "betweenInclusive",
      symbol: "⬌",
      label: localization.filterBetweenInclusive,
    },
    {},
    {
      key: "greaterThan",
      symbol: ">",
      label: localization.filterGreaterThan,
    },
    {
      key: "greaterThanOrEqualTo",
      symbol: "≥",
      label: localization.filterGreaterThanOrEqualTo,
    },
    {
      key: "lessThan",
      symbol: "<",
      label: localization.filterLessThan,
    },
    {
      key: "lessThanOrEqualTo",
      symbol: "≤",
      label: localization.filterLessThanOrEqualTo,
    },
    {},
    {
      key: "empty",
      symbol: "∅",
      label: localization.filterEmpty,
    },
    {
      key: "notEmpty",
      symbol: "!∅",
      label: localization.filterNotEmpty,
    },
  ];

  const restrictedFns = [
    {
      key: "contains",
      symbol: "*",
      label: localization.filterContains,
    },
    {
      key: "fuzzy",
      symbol: "≈",
      label: localization.filterFuzzy,
    },
    {
      key: "startsWith",
      symbol: "a",
      label: localization.filterStartsWith,
    },
    {
      key: "endsWith",
      symbol: "z",
      label: localization.filterEndsWith,
    },
    {},
  ];

  if (columnType !== "date" && columnType !== "select") baseFns = [...restrictedFns, ...baseFns];

  type FilterFnObject =
    | {
        key: string;
        symbol: string;
        label: string;
      }
    | {
        key?: undefined;
        symbol?: undefined;
        label?: undefined;
      };

  const isEmpty = (obj: FilterFnObject) => !obj.key;

  function applyDefaultFilterFns(values: Array<FilterFnObject>) {
    const defaultFilterFnOptions = (currentColumn?.filteringProps as InputCommonFiltering)?.defaultFilterFnOptions;
    if (defaultFilterFnOptions) {
      const valuesToApply: FilterFnObject[] = [];
      for (let index = 0; index < values.length; index++) {
        const currItem = values[index];
        if (
          (isEmpty(currItem) && valuesToApply[valuesToApply.length - 1]?.key) ||
          defaultFilterFnOptions.includes(currItem.key as CompleteFilterFnDefinition)
        )
          valuesToApply.push(currItem);
      }
      const lastItem = valuesToApply[valuesToApply.length - 1];
      if (isEmpty(lastItem)) valuesToApply.pop();
      return valuesToApply;
    }
    return values;
  }

  return applyDefaultFilterFns(baseFns).map((it) => {
    if (it.key)
      return {
        content: (
          <div className="content-wrapper">
            <span className="symbol">{it.symbol}</span>
            <span>{it.label}</span>
          </div>
        ),
        isSelected: it.key === activeColFilterFn,
        onClick: () => {
          if (it.key !== activeColFilterFn) dataTools.updateCurrentFilterFn(key, it.key as CompleteFilterFnDefinition);
          hideMenu();
        },
      };
    return {};
  });
};
