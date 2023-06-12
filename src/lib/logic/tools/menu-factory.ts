/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useCallback } from "react";
import { OptionsMenu } from "../../components/ui/SettingsMenu/SettingsMenu";
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
    [
      dataTools.currentFilterFns,
      dataTools.currentSorting,
      dataTools.currentPagination,
      dataTools.prefetchedFilters,
      dataTools.currentFilters,
      localization,
    ]
  );

  const headerMenuContent = useCallback(
    (key: string, hideMenu: () => void) =>
      renderHeaderActionsMenu(key, hideMenu, gridTools, dataTools, gridProps, localization, icons),
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

  const [optionsMenu, optionsMenuProps, displayOptionsMenu] = useActionsMenuFactory(
    (prop, hide, updatePosition) =>
      React.createElement(OptionsMenu, {
        updateColumnVisibility: gridTools.updateColumnVisibility as any,
        visibleColumnKeys: gridTools.visibleColumns as any,
        isDarkModeEnabled: gridTools.isDarkModeEnabled,
        isFullScreenModeEnabled: gridTools.isFullScreenModeEnabled,
        isFilterMenuVisible: gridTools.isFilterMenuVisible,
        isColumnGroupingEnabled: gridTools.isColumnGroupingEnabled,
        updateDarkMode: gridTools.updateDarkMode,
        updateFullScreenMode: gridTools.updateFullScreenMode,
        updateActiveHeader: gridTools.updateActiveHeader,
        updateFilterMenuVisibility: gridTools.updateFilterMenuVisibility,
        updateColumnGrouping: gridTools.updateColumnGrouping,
        optionsMenuProps: gridProps.settingsMenu,
        isColumnVisibilityEnabled: !!gridProps.columnVisibilityOptions?.enabled,
        isColumnFilteringEnabled: gridTools.isColumnFilteringEnabled,
        updatePosition: updatePosition,
      }),
    {
      className: "data-grid-options-menu",
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
    settingsMenu: {
      optionsMenu,
      optionsMenuProps,
      displayOptionsMenu,
    },
  };
}
