import { useState } from "react";
import { DataGridProps } from "../../types/DataGrid";
import { GridDataType } from "../../types/Utils";

export default function useGridFeatures<DataType extends GridDataType>(gridProps: DataGridProps<DataType>) {
  const [isDarkModeEnabled, setDarkModeEnabled] = useState(gridProps.theme === "dark");
  const [isFullScreenModeEnabled, setFullScreenModeEnabled] = useState(false);
  const [isFilterMenuVisible, setFilterMenuVisible] = useState<boolean>(true);
  const [isColumnGroupingEnabled, setGroupedHeadersVisible] = useState<boolean>(
    !!gridProps.groupedColumns?.enabled && !!gridProps.groupedColumns.groups && gridProps.groupedColumns.groups.length > 0
  );

  function updateFullScreenMode() {
    gridProps.settingsMenu?.fullScreenToggle?.onChange?.(!isFullScreenModeEnabled);
    setFullScreenModeEnabled(!isFullScreenModeEnabled);
  }

  function updateDarkMode() {
    gridProps.settingsMenu?.darkModeToggle?.onChange?.(isDarkModeEnabled ? "light" : "dark");
    setDarkModeEnabled(!isDarkModeEnabled);
  }

  function updateFilterMenuVisibility() {
    gridProps.settingsMenu?.filterMenuToggle?.onChange?.(!isFilterMenuVisible);
    setFilterMenuVisible(!isFilterMenuVisible);
  }

  function updateColumnGrouping() {
    gridProps.settingsMenu?.groupedColumnToggle?.onChange?.(!isColumnGroupingEnabled);
    setGroupedHeadersVisible(!isColumnGroupingEnabled);
  }

  return {
    updateDarkMode,
    updateFullScreenMode,
    updateFilterMenuVisibility,
    updateColumnGrouping,
    isDarkModeEnabled,
    isFullScreenModeEnabled,
    isFilterMenuVisible,
    isColumnGroupingEnabled,
  };
}
