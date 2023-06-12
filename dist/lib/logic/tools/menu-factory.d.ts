import React from "react";
import { DataGridIconsDefinition, DataGridLocalizationDefinition, DataGridProps } from "../../types/DataGrid";
import { DataTools, GridDataType, GridTools } from "../../types/Utils";
export declare function useMenuFactory<DataType extends GridDataType>({ dataTools, gridTools, gridProps, localization, icons, }: {
    dataTools: DataTools<DataType>;
    gridTools: GridTools<DataType>;
    gridProps: DataGridProps<DataType>;
    localization: DataGridLocalizationDefinition;
    icons: DataGridIconsDefinition;
}): {
    dataActionsMenu: React.FunctionComponentElement<Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & import("../../types/Utils").ActionsMenuProps & React.RefAttributes<HTMLDivElement>> | undefined;
    displayDataActionsMenu: ({ identifier, position, data }: {
        identifier: string;
        position: import("./actions-menu-factory").ScreenPosition;
        data: DataType;
    }) => void;
    headerActionsMenu: React.FunctionComponentElement<Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & import("../../types/Utils").ActionsMenuProps & React.RefAttributes<HTMLDivElement>> | undefined;
    displayHeaderActionsMenu: ({ identifier, position, data }: {
        identifier: string;
        position: import("./actions-menu-factory").ScreenPosition;
        data: unknown;
    }) => void;
    filterFnsMenu: React.FunctionComponentElement<Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & import("../../types/Utils").ActionsMenuProps & React.RefAttributes<HTMLDivElement>> | undefined;
    filterFnsMenuProps: {
        visible: boolean;
        position: import("./actions-menu-factory").ScreenPosition | undefined;
        identifier: string | undefined;
        data: unknown;
    };
    displayFilterFnsMenu: ({ identifier, position, data }: {
        identifier: string;
        position: import("./actions-menu-factory").ScreenPosition;
        data: unknown;
    }) => void;
    settingsMenu: {
        optionsMenu: React.FunctionComponentElement<Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & import("../../types/Utils").ActionsMenuProps & React.RefAttributes<HTMLDivElement>> | undefined;
        optionsMenuProps: {
            visible: boolean;
            position: import("./actions-menu-factory").ScreenPosition | undefined;
            identifier: string | undefined;
            data: unknown;
        };
        displayOptionsMenu: ({ identifier, position, data }: {
            identifier: string;
            position: import("./actions-menu-factory").ScreenPosition;
            data: unknown;
        }) => void;
    };
};
