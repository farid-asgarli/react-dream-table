import React, { HTMLAttributes } from "react";
import "./Select.scss";
type ConditionalProps<OptionValue> = {
    multiple: false;
    value: OptionValue;
    onChange?: (val: OptionValue) => void;
} | {
    multiple: true;
    value: Array<OptionValue>;
    onChange?: (val: Array<OptionValue>) => void;
} | {
    multiple?: undefined;
    value: OptionValue;
    onChange?: (val: OptionValue) => void;
};
type DataGridSelectProps<OptionValue> = ConditionalProps<OptionValue> & {
    options: {
        value: OptionValue;
        children: React.ReactNode;
    }[];
    onOpen?: () => void;
    clearable?: boolean | undefined;
    loading?: boolean | undefined;
    attachmentType?: "fixed" | "absolute" | undefined;
};
type DataGridSelectOption<OptionValue> = HTMLAttributes<HTMLDivElement> & {
    value: OptionValue;
    children: React.ReactNode;
    checkIcon(props: React.SVGProps<SVGSVGElement>): JSX.Element;
};
export declare const Select: {
    <OptionValue extends unknown>({ options, value, onChange, onOpen, multiple, clearable, loading, attachmentType, }: DataGridSelectProps<OptionValue>): JSX.Element;
    Option<OptionValue_1 extends unknown>({ title, value, className, children, selected, checkIcon: CheckIcon, ...props }: React.HTMLAttributes<HTMLDivElement> & {
        value: OptionValue_1;
        children: React.ReactNode;
        checkIcon(props: React.SVGProps<SVGSVGElement>): JSX.Element;
    } & {
        selected?: boolean | undefined;
    }): JSX.Element;
};
export {};
