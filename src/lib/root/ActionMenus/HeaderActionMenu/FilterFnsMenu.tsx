import { DataGridLocalizationDefinition } from "../../../types/DataGrid";
import { CompleteFilterFnDefinition, DataTools, GridDataType } from "../../../types/Utils";

export const renderFilterFnsActionsMenu = <DataType extends GridDataType>(
  key: string,
  hideMenu: () => void,
  dataTools: DataTools<DataType>,
  localization: DataGridLocalizationDefinition
) => {
  const activeColFilterFn = dataTools.getColumnFilterFn(key).current;
  const columnType = dataTools.getColumnType(key);

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

  return baseFns.map((it) => {
    if (Object.keys(it).length > 0)
      return {
        content: (
          <div className="content-wrapper">
            <span className="symbol">{it.symbol}</span>
            <span>{it.label}</span>
          </div>
        ),
        isSelected: it.key === activeColFilterFn,
        onClick: () => {
          dataTools.updateCurrentFilterFn(key, it.key as CompleteFilterFnDefinition);
          hideMenu();
        },
      };
    return {};
  });
};
