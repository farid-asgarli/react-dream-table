import React, { useContext } from "react";
import { DefaultDataGridLocale } from "../types/Utils";
import {
  KeyLiteralType,
  DataGridDimensionsDefinition,
  DataGridIconsDefinition,
  DataGridLocalizationDefinition,
  DataGridStylingDefinition,
} from "../types/DataGrid";
import { GridDataType } from "../types/Utils";

type DataGridStaticContextType<DataType extends GridDataType> = {
  defaultLocale: DefaultDataGridLocale;
  localization: DataGridLocalizationDefinition;
  dimensions: DataGridDimensionsDefinition;
  styling: DataGridStylingDefinition;
  icons: DataGridIconsDefinition;
  columnVisibilityProps: { key: KeyLiteralType<DataType>; title?: string }[];
  striped: boolean;
  isRowClickable: boolean;
  animationProps: {
    duration: number;
  };
  virtualizationEnabled: boolean;
  groupingHeaderEnabled: boolean;
};

const DataGridStaticContext = React.createContext<DataGridStaticContextType<any> | null>(null);

export function useDataGridStaticContext() {
  return useContext(DataGridStaticContext)!;
}

export default DataGridStaticContext;
