import dayjs, { Dayjs } from "dayjs";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDataGridStaticContext } from "../../../../context/DataGridStaticContext";
import { StringExtensions } from "../../../../extensions/String";
import { useDetectOutsideClick } from "../../../../hooks/use-detect-outside-click/use-detect-outside-click";
import { cs } from "../../../../utils/ConcatStyles";
import Picker from "../Picker/Picker";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DefaultDateDelimiter, DefaultDateTemplate } from "../../../../static/constantProps";
import { Animations } from "../../../animations/Animations";
import { DefaultDataGridLocale } from "../../../../types/Utils";
import "./DateInput.scss";

export function dayjsFormatted(date?: string | number | dayjs.Dayjs | Date | null | undefined) {
  return dayjs(date, DefaultDateTemplate);
}

const DateInput = ({
  onChange,
  defaultValue,
  locale,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  onChange?: (value: Dayjs | null) => void;
  locale: DefaultDataGridLocale;
}) => {
  useEffect(() => {
    dayjs.extend(customParseFormat);
  }, []);

  const [inputValue, setInputValue] = useState<string>(
    defaultValue
      ? typeof defaultValue === "string"
        ? defaultValue
        : (defaultValue as unknown as Dayjs).format(DefaultDateTemplate)
      : StringExtensions.Empty
  );
  const [pickerVisible, setPickerVisible] = useState(false);
  const [focused, setFocused] = useState<boolean>(false);
  const inputCard = useRef<HTMLInputElement | null>(null);

  function matchInput(value: string) {
    const matchValue = value.replace(/\D/g, StringExtensions.Empty).match(/(\d{0,2})(\d{0,2})(\d{0,4})/);
    if (matchValue) {
      const valueToAssign = !matchValue[2]
        ? matchValue[1]
        : `${matchValue[1]}${DefaultDateDelimiter}${matchValue[2]}${`${matchValue[3] ? `${DefaultDateDelimiter}${matchValue[3]}` : ""}`}`;
      return valueToAssign;
    }
  }

  const handleChange = () => {
    if (inputCard.current) {
      const valueToAssign = matchInput(inputCard.current.value);
      if (valueToAssign !== null && valueToAssign !== undefined) {
        setInputValue(valueToAssign);
        if (valueToAssign.length === 0 && inputValue) {
          onChange?.(null);
        } else if (valueToAssign.length === DefaultDateTemplate.length) {
          const parsedDate = validateDate(valueToAssign);
          if (parsedDate) onChange?.(parsedDate);
        }
      }
    }
  };

  const handleBlur = () => {
    if (!(inputValue.length === 0 || (inputValue.length === DefaultDateTemplate.length && validateDate(inputValue)))) {
      setInputValue(StringExtensions.Empty);
      onChange?.(null);
    }
    setFocused(false);
  };

  const handleChangeDate = (fn: (date: Dayjs) => Dayjs) => {
    setInputValue((prev) => {
      const dateValue = prev.length > 0 ? dayjsFormatted(prev) : dayjs();
      const res = fn(dateValue);
      return res.format(DefaultDateTemplate);
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => handleChange(), [inputValue]);

  const validateDate = (val: string) => {
    const parsedDate = dayjs(val, DefaultDateTemplate, true);
    if (parsedDate.isValid()) return parsedDate;
    return null;
  };

  const dayjsDate = useMemo(() => {
    if (inputValue.length === DefaultDateTemplate.length && validateDate(inputValue)) return dayjsFormatted(inputValue);
    return dayjs();
  }, [inputValue]);

  const pickerRef = useRef<HTMLDivElement | null>(null);

  useDetectOutsideClick(pickerRef, () => setPickerVisible(false));
  const { dimensions, icons } = useDataGridStaticContext();

  return (
    <div className={cs("input-wrapper ", "date-picker", focused && "focused")}>
      <input
        className="basic-input"
        type="text"
        ref={inputCard}
        value={inputValue}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
        {...props}
        onChange={handleChange}
      />
      <button title="Picker" className={cs("util-button", pickerVisible && "active")} onClick={() => setPickerVisible((prev) => !prev)}>
        <icons.Date className="input-icon" />
      </button>
      <Animations.Auto className="data-grid-dp main-wrapper" visible={pickerVisible}>
        <Picker
          ref={pickerRef}
          dateAttrs={{
            setSelectedDate: handleChangeDate,
            selectedDate: dayjsDate,
          }}
          style={{
            top: dimensions.defaultHeaderFilterHeight - 15,
          }}
        />
      </Animations.Auto>
    </div>
  );
};

export default DateInput;
