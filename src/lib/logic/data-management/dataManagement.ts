/* eslint-disable react-hooks/rules-of-hooks */
import { GridDataType } from "../../types/Utils";
import { useClientDataManagement } from "./clientDataManagement";
import { IServerDataManagement, useServerDataManagement } from "./serverDataManagement";

export function useDataManagement<DataType extends GridDataType>(
  type: "client" | "server",
  props: IServerDataManagement<DataType>
) {
  if (type === "client") return useClientDataManagement(props);
  else return useServerDataManagement(props);
}
