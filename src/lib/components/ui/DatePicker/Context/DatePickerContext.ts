import { createContext, useContext } from "react";
import { PickerPortalKeys } from "../Picker/Picker";

export const DatePickerContext = createContext<{
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
}>({} as any);

export function useDatePickerContext() {
  return useContext(DatePickerContext);
}
