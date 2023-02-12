import { useMemo, useState } from "react";
import { useDataGridStaticContext } from "../../../../../context/DataGridStaticContext";
import { cs } from "../../../../../utils/ConcatStyles";
import ButtonPrimary from "../../../Buttons/ButtonPrimary/ButtonPrimary";
import { useDatePickerContext } from "../../Context/DatePickerContext";

export default function YearPicker() {
  const {
    pickerDateState: { decade: pickedDecade, year: pickedYear },
    updatePickedYear,
    updatePickedDecadeRange,
    updateCurrentPicker,
  } = useDatePickerContext();

  const [flow, setFlow] = useState<"left-flow" | "right-flow">();

  const generateYears = useMemo(() => {
    const years: Array<number> = [];
    for (let year = pickedDecade[0]; year <= pickedDecade[1]; year++) {
      years.push(year);
    }
    return years;
  }, [pickedDecade]);

  const { icons, localization } = useDataGridStaticContext();

  function previousRange() {
    setFlow("left-flow");
    updatePickedDecadeRange([pickedDecade[0] - 10, pickedDecade[0]]);
  }
  function nextRange() {
    setFlow("right-flow");
    updatePickedDecadeRange([pickedDecade[1], pickedDecade[1] + 10]);
  }

  function isYearCurrent(year: number) {
    return pickedYear === year;
  }

  return (
    <div className="calendar-picker">
      <div className="arrows-wrapper">
        <ButtonPrimary onClick={previousRange} title={localization.paginationPrev}>
          <icons.ArrowLeft className="button-icon" />
        </ButtonPrimary>
        <button className="picker-view-update" type="button" onClick={() => updateCurrentPicker("decade")}>
          {pickedDecade[0]} - {pickedDecade[1]}
        </button>
        <ButtonPrimary onClick={nextRange} title={localization.paginationNext}>
          <icons.ArrowRight className="button-icon" />
        </ButtonPrimary>
      </div>
      <div key={pickedDecade[0]} className={cs("calendar-content-wrapper", flow)}>
        <div className="calendar-content">
          {generateYears.map((year, index) => (
            <button
              type="button"
              onClick={() => {
                updatePickedYear(year);
                updateCurrentPicker("month");
              }}
              className={cs("calendar-range-cell", isYearCurrent(year) && "current-range")}
              key={index}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
