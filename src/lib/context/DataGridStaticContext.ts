import React, { useContext } from "react";
import {
  KeyLiteralType,
  DataGridDimensionsDefinition,
  DataGridIconsDefinition,
  DataGridLocalizationDefinition,
  DataGridThemeDefinition,
} from "../types/DataGrid";
import { FooterProps } from "../types/Utils";

type DataGridStaticContextType<DataType> = {
  localization: DataGridLocalizationDefinition;
  dimensions: DataGridDimensionsDefinition;
  theming: DataGridThemeDefinition;
  icons: DataGridIconsDefinition;
  optionsMenuColumns: { key: KeyLiteralType<DataType>; title?: string }[];
  paginationDefaults: FooterProps<DataType>["paginationDefaults"];
  striped: boolean;
  isRowClickable: boolean;
  animationProps: {
    duration: number;
  };
  virtualizationEnabled: boolean;
};

const DataGridStaticContext = React.createContext<DataGridStaticContextType<any> | null>(null);

export function useDataGridStaticContext() {
  return useContext(DataGridStaticContext)!;
}

export default DataGridStaticContext;
