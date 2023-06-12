/// <reference types="react" />
import { PickerPortalKeys } from "../Picker/Picker";
export declare const DatePickerContext: import("react").Context<{
    updateCurrentPicker: (key: PickerPortalKeys) => void;
    updatePickedCenturyRange: (value: [number, number]) => void;
    updatePickedDecadeRange: (value: [number, number]) => void;
    updatePickedYear: (value: number) => void;
    updatePickedMonth: (value: number) => void;
    updatePickedDay: (value: Date) => void;
    pickerDateState: {
        century: [number, number];
        decade: [number, number];
        year: number;
        month: number;
    };
}>;
export declare function useDatePickerContext(): {
    updateCurrentPicker: (key: PickerPortalKeys) => void;
    updatePickedCenturyRange: (value: [number, number]) => void;
    updatePickedDecadeRange: (value: [number, number]) => void;
    updatePickedYear: (value: number) => void;
    updatePickedMonth: (value: number) => void;
    updatePickedDay: (value: Date) => void;
    pickerDateState: {
        century: [number, number];
        decade: [number, number];
        year: number;
        month: number;
    };
};
