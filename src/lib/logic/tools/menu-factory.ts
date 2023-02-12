/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback } from "react";
import { renderFilterFnsActionsMenu } from "../../root/ActionMenus/HeaderActionMenu/FilterFnsMenu";
import { renderHeaderActionsMenu } from "../../root/ActionMenus/HeaderActionMenu/HeaderActionMenu";
import { DataGridIconsDefinition, DataGridLocalizationDefinition, DataGridProps } from "../../types/DataGrid";
import { DataTools, GridDataType, GridTools } from "../../types/Utils";
import useActionsMenuFactory from "./actions-menu-factory";

export function useMenuFactory<DataType extends GridDataType>({
  dataTools,
  gridTools,
  gridProps,
  localization,
  icons,
}: {
  dataTools: DataTools<DataType>;
  gridTools: GridTools<DataType>;
  gridProps: DataGridProps<DataType>;
  localization: DataGridLocalizationDefinition;
  icons: DataGridIconsDefinition;
}) {
  const filterFnsMenuContent = useCallback(
    (key: string, hideMenu: () => void) => renderFilterFnsActionsMenu(key, hideMenu, dataTools, localization),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataTools.currentFilterFns, localization]
  );

  const headerMenuContent = useCallback(
    (key: string, hideMenu: () => void) => renderHeaderActionsMenu(key, hideMenu, gridTools, dataTools, gridProps, localization, icons),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      gridTools.pinnedColumns,
      gridTools.updateColumnVisibility,
      gridTools.updatePinnedColumns,
      gridProps.columnVisibilityOptions?.enabled,
      gridProps.pinnedColumns?.enabled,
    ]
  );

  const [dataActionsMenu, _, displayDataActionsMenu] = useActionsMenuFactory(
    (props, hide) => gridProps.rowActionsMenu?.render?.(props.data, hide) ?? [],
    undefined,
    gridProps.rowActionsMenu?.onOpen,
    () => {
      gridProps.rowActionsMenu?.onHide?.();
      gridTools.clearActiveRow();
    }
  );

  const [headerActionsMenu, __, displayHeaderActionsMenu] = useActionsMenuFactory((props, hide) =>
    headerMenuContent(props.identifier!, hide)
  );

  const [filterFnsMenu, filterFnsMenuProps, displayFilterFnsMenu] = useActionsMenuFactory(
    (props, hide) => filterFnsMenuContent(props.identifier!, hide),
    {
      className: "filter-fns-menu",
    }
  );

  return {
    dataActionsMenu,
    displayDataActionsMenu,
    headerActionsMenu,
    displayHeaderActionsMenu,
    filterFnsMenu,
    filterFnsMenuProps,
    displayFilterFnsMenu,
  };
}
