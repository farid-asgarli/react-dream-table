import React, { useContext } from "react";
import { DefaultTableDimensions } from "../static/dimensions";
import { DefaultTableIcons } from "../static/icons";
import { DefaultTableLocalization } from "../static/localization";
import { DefaultTableTheme } from "../static/theme";
import {
  KeyLiteralType,
  TableDimensionsType,
  TableIconsType,
  TableLocalizationType,
  TableThemeType,
} from "../types/Table";
import { FooterProps } from "../types/Utils";
type TableContextType<DataType> = {
  localization: TableLocalizationType;
  dimensions: TableDimensionsType;
  theming: TableThemeType;
  icons: TableIconsType;
  settingsMenuColumns: { key: KeyLiteralType<DataType>; title?: string }[];
  paginationDefaults: FooterProps<DataType>["paginationDefaults"];
  striped: boolean;
  isAnyColumnPinned: boolean;
};

const TableContext = React.createContext<TableContextType<any>>({
  localization: DefaultTableLocalization,
  dimensions: DefaultTableDimensions,
  theming: DefaultTableTheme,
  icons: DefaultTableIcons,
  settingsMenuColumns: [],
  paginationDefaults: undefined,
  striped: false,
  isAnyColumnPinned: false,
});

export function useTableContext() {
  return useContext(TableContext);
}

export default TableContext;
