import React, { useContext } from "react";
import { DefaultTableLocalization } from "../localization/default";
import { DefaultTableDimensions } from "../static/dimensions";
import { DefaultTableTheme } from "../theme/default";
import {
  FilterDisplayStrategy,
  TableDimensionsType,
  TableLocalizationType,
  TableProps,
  TableThemeType,
} from "../types/Table";
import { PaginationContainerProps } from "../types/Utils";
type TableContextType = {
  localization: TableLocalizationType;
  tableDimensions: TableDimensionsType;
  themeProperties: TableThemeType;
  tableHeight: string | number;
  settingsMenuColumns: { key: string; title?: string }[];
  elementStylings?: TableProps<any>["elementStylings"];
  filterDisplayStrategy: FilterDisplayStrategy;
  paginationDefaults: PaginationContainerProps["paginationDefaults"];
  striped: boolean;
};

export const TableContext = React.createContext<TableContextType>({
  localization: DefaultTableLocalization,
  tableDimensions: DefaultTableDimensions,
  themeProperties: DefaultTableTheme,
  tableHeight: "100%",
  settingsMenuColumns: [],
  filterDisplayStrategy: "default",
  paginationDefaults: undefined,
  striped: false,
});

export function useTableContext() {
  return useContext(TableContext);
}
