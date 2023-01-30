import React, { useContext } from "react";
import {
  KeyLiteralType,
  TableDimensionsType,
  TableIconsType,
  TableLocalizationType,
  TableThemeType,
} from "../types/Table";
import { FooterProps } from "../types/Utils";
type DataGridContextType<DataType> = {
  localization: TableLocalizationType;
  dimensions: TableDimensionsType;
  theming: TableThemeType;
  icons: TableIconsType;
  optionsMenuColumns: { key: KeyLiteralType<DataType>; title?: string }[];
  paginationDefaults: FooterProps<DataType>["paginationDefaults"];
  striped: boolean;
  animationProps: {
    duration: number;
  };
};

const DataGridContext = React.createContext<DataGridContextType<any> | null>(null);

export function useDataGridContext() {
  return useContext(DataGridContext as React.Context<DataGridContextType<any>>);
}

export default DataGridContext;
