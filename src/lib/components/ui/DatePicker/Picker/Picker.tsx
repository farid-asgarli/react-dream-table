import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import DayPicker from "./DayPicker/DayPicker";
import YearPicker from "./YearPicker/YearPicker";
import DecadeRangePicker from "./DecadePicker/DecadePicker";
import MonthPicker from "./MonthPicker/MonthPicker";
import { Portal } from "../../Portal/Portal";
import { DatePickerContext } from "../Context/DatePickerContext";
import "./Picker.scss";

const portalKeys = {
  century: "century",
  decade: "decade",
  year: "year",
  month: "month",
  day: "day",
} as const;

export type PickerPortalKeys = typeof portalKeys[keyof typeof portalKeys];

function DatePicker(
  {
    dateAttrs,
    ...props
  }: React.HtmlHTMLAttributes<HTMLDivElement> & {
    dateAttrs: {
      selectedDate: Dayjs;
      setSelectedDate: (fn: (date: Dayjs) => Dayjs) => void;
    };
  },
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const [currentPicker, setCurrentPicker] = useState<PickerPortalKeys>(portalKeys.day);

  function generateRange(type: "decade" | "century"): [number, number] {
    return [
      dateAttrs.selectedDate.year() - (dateAttrs.selectedDate.year() % 10),
      dateAttrs.selectedDate.year() - (dateAttrs.selectedDate.year() % 10) + (type === "century" ? 100 : 10),
    ];
  }

  const [pickerDateState, setPickerDateState] = useState<{
    century: [number, number];
    decade: [number, number];
    year: number;
    month: number;
  }>({
    century: generateRange("century"),
    decade: generateRange("decade"),
    year: dateAttrs.selectedDate.year(),
    month: dateAttrs.selectedDate.month(),
  });

  const updatePickedCenturyRange = (value: [number, number]) => setPickerDateState((prev) => ({ ...prev, century: value }));

  const updatePickedDecadeRange = (value: [number, number]) => setPickerDateState((prev) => ({ ...prev, decade: value }));

  const updatePickedYear = (value: number) => setPickerDateState((prev) => ({ ...prev, year: value }));

  const updatePickedMonth = (value: number) => {
    if (value < 0) {
      const year = pickerDateState.year - 1;
      const rangeStart = year - (year % 10);
      setPickerDateState({
        month: value + 12,
        year: year,
        century: [rangeStart, rangeStart + 100],
        decade: [rangeStart, rangeStart + 10],
      });
    } else if (value > 11) {
      const year = pickerDateState.year + 1;
      const rangeStart = year - (year % 10);
      setPickerDateState({
        month: value - 12,
        year: year,
        century: [rangeStart, rangeStart + 100],
        decade: [rangeStart, rangeStart + 10],
      });
    } else
      setPickerDateState((prev) => ({
        ...prev,
        month: value,
      }));
  };

  const updatePickedDay = (value: Date) => {
    dateAttrs.setSelectedDate(() => dayjs(value));
  };

  function updateCurrentPicker(key: PickerPortalKeys) {
    setCurrentPicker(key);
  }

  function updateDateEntries() {
    setPickerDateState({
      century: generateRange("century"),
      decade: generateRange("decade"),
      year: dateAttrs.selectedDate.year(),
      month: dateAttrs.selectedDate.month(),
    });
  }

  useEffect(() => {
    updateDateEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateAttrs.selectedDate]);

  return (
    <DatePickerContext.Provider
      value={{
        updateCurrentPicker,
        updatePickedCenturyRange,
        updatePickedDecadeRange,
        updatePickedYear,
        updatePickedMonth,
        updatePickedDay,
        pickerDateState,
      }}
    >
      <div className="data-grid-dp main-wrapper" ref={ref} {...props}>
        <Portal.Container
          animationVariant="zoom"
          activeWindowIndex={currentPicker}
          indexOrder={["century", "decade", "year", "month", "day"] as PickerPortalKeys[]}
        >
          <Portal.Window index={portalKeys.decade}>
            <DecadeRangePicker />
          </Portal.Window>
          <Portal.Window index={portalKeys.year}>
            <YearPicker />
          </Portal.Window>
          <Portal.Window index={portalKeys.month}>
            <MonthPicker />
          </Portal.Window>
          <Portal.Window index={portalKeys.day}>
            <DayPicker selectedDate={dateAttrs.selectedDate} />
          </Portal.Window>
        </Portal.Container>
      </div>
    </DatePickerContext.Provider>
  );
}
export default React.forwardRef(DatePicker);
