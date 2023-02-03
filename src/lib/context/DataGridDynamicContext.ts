import { createContext, useContext } from "react";

type DataGridDynamicContextType = {};

const DataGridDynamicContext = createContext<DataGridDynamicContextType | null>(null);

export function useDataGridDynamicContext() {
  return useContext(DataGridDynamicContext)!;
}

export default DataGridDynamicContext;
