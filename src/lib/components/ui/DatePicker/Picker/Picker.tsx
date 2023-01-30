import { useCallback, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import ArrowLeft from "../../../../icons/ArrowLeft";
import ArrowRight from "../../../../icons/ArrowRight";
import { cs } from "../../../../utils/ConcatStyles";
import React from "react";
import "./Picker.css";
import "dayjs/locale/az";
import "dayjs/locale/en";
import { useDataGridContext } from "../../../../context/DataGridContext";

function DatePicker(
  {
    dateAttrs: { selectedDate, setSelectedDate },
    pickerLocale,
    ...props
  }: React.HtmlHTMLAttributes<HTMLDivElement> & {
    dateAttrs: {
      selectedDate: Dayjs;
      setSelectedDate: (fn: (date: Dayjs) => Dayjs) => void;
    };
    pickerLocale: "en" | "az";
  },
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const currentDay = useMemo(() => dayjs().toDate(), []);

  const firstDayOfTheMonth = useMemo(() => selectedDate.clone().startOf("month"), [selectedDate]);

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
    for (let i = 0; i < 7; i++) {
      const date = day.clone().add(i, "day").toDate();
      dates.push(date);
    }
    return dates;
  }, []);

  const generateWeeksOfTheMonth = useMemo((): Date[][] => {
    const firstDayOfEachWeek = generateFirstDayOfEachWeek(firstDayOfFirstWeekOfMonth);
    return firstDayOfEachWeek.map((date) => generateWeek(date));
  }, [generateFirstDayOfEachWeek, firstDayOfFirstWeekOfMonth, generateWeek]);

  const [flow, setFlow] = useState<"left-flow" | "right-flow">();

  const { localization } = useDataGridContext();

  return (
    <div className="data-grid-dp main-wrapper" ref={ref} {...props}>
      <div className="calendar-header-wrapper">
        <h3>{selectedDate.clone().locale(pickerLocale).format("MMM YYYY")}</h3>
        <div className="arrows-wrapper">
          <button
            className="calendar-day-cell"
            onClick={() => {
              setFlow("left-flow");
              setSelectedDate((date) => date.subtract(1, "month"));
            }}
            title={localization.paginationPrev}
          >
            <ArrowLeft className="calendar-icon" />
          </button>
          <button
            className="calendar-day-cell"
            onClick={() => {
              setFlow("right-flow");
              setSelectedDate((date) => date.add(1, "month"));
            }}
            title={localization.paginationNext}
          >
            <ArrowRight className="calendar-icon" />
          </button>
        </div>
      </div>
      <div className="week-days-wrapper">
        {generateWeeksOfTheMonth[0].map((day, index) => (
          <div className="week-day-cell" key={`week-day-${index}`}>
            {dayjs(day).locale(pickerLocale).format("dd")}
          </div>
        ))}
      </div>
      <div className="calendar-flow">
        <div key={selectedDate.month()} className={cs("calendar-content-wrapper", flow)}>
          {generateWeeksOfTheMonth.map((week, weekIndex) => (
            <div className="calendar-content" key={`week-${weekIndex}`}>
              {week.map((day, dayIndex) => (
                <button
                  className="calendar-day-cell"
                  key={`day-${dayIndex}`}
                  onClick={() => setSelectedDate(() => dayjs(day))}
                  style={{
                    background: dayjs(day).isSame(selectedDate, "date") ? "var(--color-hover)" : undefined,
                    color:
                      selectedDate.clone().toDate().getMonth() !== day.getMonth()
                        ? "#DAE1E7"
                        : dayjs(currentDay).isSame(day, "date")
                        ? "#E43F5A"
                        : "#1B1B2F",
                  }}
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
export default React.forwardRef(DatePicker);
