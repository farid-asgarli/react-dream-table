import React from "react";
import { HeaderWrapperProps } from "../../types/Elements";
import { GridDataType } from "../../types/Utils";
import "./HeaderWrapper.scss";
export type HeaderWrapperRef = {
    updateHeaderTransform: (scroll: number, verticalScrollbarWidth: number) => void;
    updateLockedStartTransform: (scroll: number) => void;
    updateLockedEndTransform: (scroll: number) => void;
};
declare function HeaderWrapper<DataType extends GridDataType>({ columnsToRender, totalColumnsWidth, verticalScrollbarWidth, pinnedColumns, gridTools, dataTools, gridProps, onColumnHeaderFocus, headerActionsMenu, filterFnsMenu, containerHeight, headerWrapperRef, groupedColumnHeaders, ...props }: React.HtmlHTMLAttributes<HTMLDivElement> & HeaderWrapperProps<DataType>): JSX.Element;
export default HeaderWrapper;
