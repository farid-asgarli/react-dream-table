import { useState } from "react";
import { useDetectKeyPress } from "../../hooks/use-detect-key-press/use-detect-key-press";
import { DataGridProps } from "../../types/DataGrid";
import { GridDataType } from "../../types/Utils";

export default function useGridFeatures<DataType extends GridDataType>(gridProps: DataGridProps<DataType>) {
  const [isDarkModeEnabled, setDarkModeEnabled] = useState(gridProps.theme === "dark");
  const [isFullScreenModeEnabled, setFullScreenModeEnabled] = useState(false);
  const [isFilterMenuVisible, setFilterMenuVisible] = useState<boolean>(gridProps.columns.some((x) => x.filter));
  const [isColumnGroupingEnabled, setGroupedHeadersVisible] = useState<boolean>(
    !!gridProps.groupedColumns?.enabled &&
      !!gridProps.groupedColumns.groups &&
      gridProps.groupedColumns.groups.length > 0
  );

  function updateFullScreenMode() {
    gridProps.settingsMenu?.fullScreenToggle?.onChange?.(!isFullScreenModeEnabled);
    setFullScreenModeEnabled((prev) => !prev);
  }

  function updateDarkMode() {
    gridProps.settingsMenu?.darkModeToggle?.onChange?.(isDarkModeEnabled ? "light" : "dark");
    setDarkModeEnabled((prev) => !prev);
  }

  function updateFilterMenuVisibility() {
    gridProps.settingsMenu?.filterMenuToggle?.onChange?.(!isFilterMenuVisible);
    setFilterMenuVisible((prev) => !prev);
  }

  function updateColumnGrouping() {
    gridProps.settingsMenu?.groupedColumnToggle?.onChange?.(!isColumnGroupingEnabled);
    setGroupedHeadersVisible((prev) => !prev);
  }

  useDetectKeyPress((key) => key === "Escape" && setFullScreenModeEnabled(false));

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
