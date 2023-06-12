/// <reference types="react" />
import { DataGridIconsDefinition, DataGridLocalizationDefinition, DataGridProps } from "../../../types/DataGrid";
import "./../ActionMenus.scss";
export declare const renderHeaderActionsMenu: (key: string, hideMenu: () => void, gridTools: any, dataTools: any, gridProps: DataGridProps<any>, localization: DataGridLocalizationDefinition, icons: DataGridIconsDefinition) => ({
    symbol: typeof import("../../../icons/PinLeft").default;
    label: string;
    key: string;
    onClick: () => void;
} | {
    symbol?: undefined;
    label?: undefined;
    key?: undefined;
    onClick?: undefined;
} | {
    content: JSX.Element;
    symbol: typeof import("../../../icons/PinLeft").default;
    label: string;
    key: string;
    onClick: () => void;
} | {
    content: JSX.Element;
    symbol?: undefined;
    label?: undefined;
    key?: undefined;
    onClick?: undefined;
} | undefined)[];
