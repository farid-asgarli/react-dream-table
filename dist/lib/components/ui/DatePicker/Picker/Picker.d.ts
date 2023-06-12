import dayjs from "dayjs";
import React from "react";
import "./Picker.scss";
declare const portalKeys: {
    readonly century: "century";
    readonly decade: "decade";
    readonly year: "year";
    readonly month: "month";
    readonly day: "day";
};
export type PickerPortalKeys = typeof portalKeys[keyof typeof portalKeys];
declare const _default: React.ForwardRefExoticComponent<React.HtmlHTMLAttributes<HTMLDivElement> & {
    dateAttrs: {
        selectedDate: dayjs.Dayjs;
        setSelectedDate: (fn: (date: dayjs.Dayjs) => dayjs.Dayjs) => void;
    };
} & React.RefAttributes<HTMLDivElement>>;
export default _default;
