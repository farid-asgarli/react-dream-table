/// <reference types="react" />
import { GridDataType, OptionsMenuProps } from "../../../types/Utils";
import "./SettingsMenu.scss";
export declare function OptionsMenu<DataType extends GridDataType>({ visibleColumnKeys, className, optionsMenuProps, isDarkModeEnabled, isFullScreenModeEnabled, isFilterMenuVisible, isColumnGroupingEnabled, isColumnVisibilityEnabled, isColumnFilteringEnabled, updateDarkMode, updateActiveHeader, updateFullScreenMode, updateColumnVisibility, updateFilterMenuVisibility, updateColumnGrouping, updatePosition, ...props }: OptionsMenuProps<DataType>): JSX.Element;
