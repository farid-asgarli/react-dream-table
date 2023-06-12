import React from "react";
import { HtmlHTMLAttributes } from "react";
import { ActionsMenuListItem } from "../../types/Utils";
export type ScreenPosition = {
    xAxis: number;
    yAxis: number;
};
export type DisplayActionsMenu<DataType> = ({ identifier, position, data, }: {
    identifier: string;
    position: ScreenPosition;
    data: DataType;
}) => void;
type ActionsMenuVisibilityProps<TData> = {
    visible: boolean;
    position: ScreenPosition | undefined;
    identifier: string | undefined;
    data: TData | undefined;
};
type ActionsMenuBodyProps = Pick<HtmlHTMLAttributes<HTMLDivElement>, "style" | "className">;
export default function useActionsMenuFactory<TData>(factory: (props: ActionsMenuVisibilityProps<TData>, hide: () => void, updatePosition: () => void) => React.ReactNode | (ActionsMenuListItem | undefined)[], bodyProps?: ActionsMenuBodyProps, onOpen?: (data: TData) => void, onHide?: () => void): readonly [React.FunctionComponentElement<Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & import("../../types/Utils").ActionsMenuProps & React.RefAttributes<HTMLDivElement>> | undefined, ActionsMenuVisibilityProps<TData>, ({ identifier, position, data }: {
    identifier: string;
    position: ScreenPosition;
    data: TData;
}) => void, (destroyOnClose?: boolean) => void];
export {};
