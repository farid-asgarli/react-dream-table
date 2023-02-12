import dayjs, { Dayjs } from "dayjs";
import { useMemo, useState } from "react";
import { useDataGridStaticContext } from "../../../../../context/DataGridStaticContext";
import { cs } from "../../../../../utils/ConcatStyles";
import ButtonPrimary from "../../../Buttons/ButtonPrimary/ButtonPrimary";
import { useDatePickerContext } from "../../Context/DatePickerContext";

export default function MonthPicker() {
  const {
    pickerDateState: { year: pickedYear },
    updatePickedYear,
    updatePickedMonth,
    updateCurrentPicker,
  } = useDatePickerContext();

  const currentDay = useMemo(() => dayjs(), []);

  const [flow, setFlow] = useState<"left-flow" | "right-flow">();
  const { icons, localization } = useDataGridStaticContext();
  const generateMonths = useMemo(() => {
    const monthArray: Array<Dayjs> = [];
    for (let index = 0; index < 12; index++) {
      monthArray.push(dayjs().set("year", pickedYear).month(index));
    }
    return monthArray;
  }, [pickedYear]);

  function previousRange() {
    setFlow("left-flow");
    updatePickedYear(pickedYear - 1);
  }
  function nextRange() {
    setFlow("right-flow");
    updatePickedYear(pickedYear + 1);
  }

  function isMonthCurrent(date: Dayjs) {
    return date.month() === currentDay.month() && date.year() === currentDay.year();
  }

  return (
    <div className="calendar-picker">
      <div className="arrows-wrapper">
        <ButtonPrimary onClick={previousRange} title={localization.paginationPrev}>
          <icons.ArrowLeft className="button-icon" />
        </ButtonPrimary>
        <button className="picker-view-update" type="button" onClick={() => updateCurrentPicker("year")}>
          {pickedYear}
        </button>
        <ButtonPrimary onClick={nextRange} title={localization.paginationNext}>
          <icons.ArrowRight className="button-icon" />
        </ButtonPrimary>
      </div>
      <div key={pickedYear} className={cs("calendar-content-wrapper", flow)}>
        <div className="calendar-content">
          {generateMonths.map((date, index) => (
            <button
              type="button"
              onClick={() => {
                updatePickedMonth(date.month());
                updateCurrentPicker("day");
              }}
              className={cs("calendar-range-cell", isMonthCurrent(date) && "current-range")}
              key={index}
            >
              {date.format("MMM")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
