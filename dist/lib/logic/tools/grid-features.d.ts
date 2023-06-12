import { DataGridProps } from "../../types/DataGrid";
import { GridDataType } from "../../types/Utils";
export default function useGridFeatures<DataType extends GridDataType>(gridProps: DataGridProps<DataType>): {
    updateDarkMode: () => void;
    updateFullScreenMode: () => void;
    updateFilterMenuVisibility: () => void;
    updateColumnGrouping: () => void;
    isDarkModeEnabled: boolean;
    isFullScreenModeEnabled: boolean;
    isFilterMenuVisible: boolean;
    isColumnGroupingEnabled: boolean;
};
