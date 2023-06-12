import dayjs, { Dayjs } from "dayjs";
import React from "react";
import { DefaultDataGridLocale } from "../../../../types/Utils";
import "./DateInput.scss";
export declare function dayjsFormatted(date?: string | number | dayjs.Dayjs | Date | null | undefined): dayjs.Dayjs;
declare const DateInput: ({ onChange, defaultValue, locale, ...props }: Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
    onChange?: ((value: Dayjs | null) => void) | undefined;
    locale: DefaultDataGridLocale;
}) => JSX.Element;
export default DateInput;
