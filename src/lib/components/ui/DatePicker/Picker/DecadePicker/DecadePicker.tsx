import { useMemo, useState } from "react";
import { useDataGridStaticContext } from "../../../../../context/DataGridStaticContext";
import { cs } from "../../../../../utils/ConcatStyles";
import ButtonPrimary from "../../../Buttons/ButtonPrimary/ButtonPrimary";
import { useDatePickerContext } from "../../Context/DatePickerContext";

export default function DecadePicker() {
  const [flow, setFlow] = useState<"left-flow" | "right-flow">();

  const {
    pickerDateState: { century: pickedCentury, year: pickedYear },
    updatePickedCenturyRange,
    updatePickedDecadeRange,
    updateCurrentPicker,
  } = useDatePickerContext();

  const generateYearRanges = useMemo(() => {
    const yearRanges: Array<[number, number]> = [];
    for (let index = 1; index <= 10; index++) {
      const rangeStart = pickedCentury[0] + 10 * (index - 1);
      const rangeEnd = pickedCentury[0] + 10 * index;
      yearRanges.push([rangeStart, rangeEnd]);
    }
    return yearRanges;
  }, [pickedCentury]);

  function previousDecade() {
    setFlow("left-flow");
    updatePickedCenturyRange([pickedCentury[0] - 100, pickedCentury[0]]);
  }

  function nextDecade() {
    setFlow("right-flow");
    updatePickedCenturyRange([pickedCentury[1], pickedCentury[1] + 100]);
  }

  const { icons, localization } = useDataGridStaticContext();

  function isRangeCurrent(range: [number, number]) {
    return range[0] < pickedYear && range[1] > pickedYear;
  }

  return (
    <div className="calendar-picker">
      <div className="arrows-wrapper">
        <ButtonPrimary onClick={previousDecade} title={localization.paginationPrev}>
          <icons.ArrowLeft className="button-icon" />
        </ButtonPrimary>
        <button className="picker-view-update" type="button">
          {pickedCentury[0]} - {pickedCentury[1]}
        </button>

        <ButtonPrimary onClick={nextDecade} title={localization.paginationNext}>
          <icons.ArrowRight className="button-icon" />
        </ButtonPrimary>
      </div>
      <div key={pickedCentury[0]} className={cs("calendar-content-wrapper", flow)}>
        <div className="calendar-content">
          {generateYearRanges.map((range, index) => (
            <button
              type="button"
              // title={`${range[0]}-${range[1]}`}
              className={cs("calendar-range-cell", isRangeCurrent(range) && "current-range")}
              key={index}
              onClick={() => {
                updatePickedDecadeRange(range);
                updateCurrentPicker("year");
              }}
            >
              {range[0]}-{range[1]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
