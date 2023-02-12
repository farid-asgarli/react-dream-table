import dayjs, { Dayjs } from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { useDataGridStaticContext } from "../../../../../context/DataGridStaticContext";
import { StringExtensions } from "../../../../../extensions/String";
import { cs } from "../../../../../utils/ConcatStyles";
import ButtonPrimary from "../../../Buttons/ButtonPrimary/ButtonPrimary";
import { useDatePickerContext } from "../../Context/DatePickerContext";
import "dayjs/locale/az";
import "dayjs/locale/en";
import "dayjs/locale/ru";

export default function DayPicker({ selectedDate }: { selectedDate: Dayjs }) {
  const {
    pickerDateState: { month: pickedMonth, year: pickedYear },
    updateCurrentPicker,
    updatePickedMonth,
    updatePickedDay,
  } = useDatePickerContext();
  const { localization, icons, defaultLocale } = useDataGridStaticContext();
  const currentDay = useMemo(() => dayjs().toDate(), []);

  const firstDayOfTheMonth = useMemo(() => dayjs().month(pickedMonth).year(pickedYear).startOf("month"), [pickedMonth, pickedYear]);

  const firstDayOfFirstWeekOfMonth = useMemo(() => dayjs(firstDayOfTheMonth).startOf("week"), [firstDayOfTheMonth]);

  const generateFirstDayOfEachWeek = useCallback((day: Dayjs): Dayjs[] => {
    const dates: Dayjs[] = [day];
    for (let i = 1; i < 6; i++) {
      const date = day.clone().add(i, "week");
      dates.push(date);
    }
    return dates;
  }, []);

  const generateWeek = useCallback((day: Dayjs): Date[] => {
    const dates: Date[] = [];
    for (let i = 1; i < 8; i++) {
      const date = day.clone().add(i, "day").toDate();
      dates.push(date);
    }
    return dates;
  }, []);

  const generateWeeksOfTheMonth = useMemo((): Date[][] => {
    const firstDayOfEachWeek = generateFirstDayOfEachWeek(firstDayOfFirstWeekOfMonth);
    return firstDayOfEachWeek.map(generateWeek);
  }, [generateFirstDayOfEachWeek, firstDayOfFirstWeekOfMonth, generateWeek]);

  const [flow, setFlow] = useState<"left-flow" | "right-flow">();

  const assignDateStatus = useCallback(
    function (day: Date) {
      if (pickedMonth !== day.getMonth()) return "diff-month";
      else if (dayjs(currentDay).isSame(day, "date")) return "current-day";
      return StringExtensions.Empty;
    },
    [currentDay, pickedMonth]
  );

  return (
    <div className="calendar-day-picker">
      <div className="calendar-header-wrapper">
        <div className="calendar-header-title">
          <button className="picker-view-update" type="button" onClick={() => updateCurrentPicker("month")}>
            {dayjs().year(pickedYear).month(pickedMonth).locale(defaultLocale).format("MMMM")}
          </button>
          <button className="picker-view-update" type="button" onClick={() => updateCurrentPicker("year")}>
            {dayjs().year(pickedYear).month(pickedMonth).format("YYYY")}
          </button>
        </div>
        <div className="arrows-wrapper">
          <ButtonPrimary
            onClick={() => {
              setFlow("left-flow");
              updatePickedMonth(pickedMonth - 1);
            }}
            title={localization.paginationPrev}
          >
            <icons.ArrowLeft className="button-icon" />
          </ButtonPrimary>
          <ButtonPrimary
            onClick={() => {
              setFlow("right-flow");
              updatePickedMonth(pickedMonth + 1);
            }}
            title={localization.paginationNext}
          >
            <icons.ArrowRight className="button-icon" />
          </ButtonPrimary>
        </div>
      </div>
      <div className="week-days-wrapper">
        {generateWeeksOfTheMonth[0].map((day, index) => (
          <div className="week-day-cell" key={`week-day-${index}`}>
            {dayjs(day).locale(defaultLocale).format("dd")}
          </div>
        ))}
      </div>
      <div className="calendar-flow">
        <div key={pickedMonth} className={cs("calendar-content-wrapper", flow)}>
          {generateWeeksOfTheMonth.map((week, weekIndex) => (
            <div className="calendar-content" key={`week-${weekIndex}`}>
              {week.map((day, dayIndex) => (
                <button
                  className={cs("calendar-day-cell", assignDateStatus(day), dayjs(day).isSame(selectedDate, "date") && "selected")}
                  key={`day-${dayIndex}`}
                  onClick={() => updatePickedDay(day)}
                >
                  {day.getDate()}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
