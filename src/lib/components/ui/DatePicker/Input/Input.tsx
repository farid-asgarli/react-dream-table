import dayjs, { Dayjs } from "dayjs";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDataGridContext } from "../../../../context/DataGridContext";
import { StringExtensions } from "../../../../extensions/String";
import { useDetectOutsideClick } from "../../../../hooks/use-detect-outside-click/use-detect-outside-click";
import { cs } from "../../../../utils/ConcatStyles";
import Fade from "../../../animations/Fade/Fade";
import Picker from "../Picker/Picker";
import "./Input.css";

const DatePicker = ({
  onChange,
  defaultValue,
  locale,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  onChange?: (value: Dayjs | null) => void;
  locale: "en" | "az";
}) => {
  const dateDelimiter = "/";
  const dateTemplate = `MM${dateDelimiter}DD${dateDelimiter}YYYY`;
  const [inputValue, setInputValue] = useState<string>(
    defaultValue
      ? typeof defaultValue === "string"
        ? defaultValue
        : (defaultValue as unknown as Dayjs).format(dateTemplate)
      : StringExtensions.Empty
  );
  const [pickerVisible, setPickerVisible] = useState(false);
  const [focused, setFocused] = useState<boolean>(false);
  const inputCard = useRef<HTMLInputElement | null>(null);

  function matchInput(value: string) {
    const matchValue = value.replace(/\D/g, "").match(/(\d{0,2})(\d{0,2})(\d{0,4})/);
    if (matchValue) {
      const valueToAssign = !matchValue[2]
        ? matchValue[1]
        : `${matchValue[1]}${dateDelimiter}${matchValue[2]}${`${
            matchValue[3] ? `${dateDelimiter}${matchValue[3]}` : ""
          }`}`;
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
        } else if (valueToAssign.length === 10) {
          const parsedDate = validateDate(valueToAssign);
          if (parsedDate) onChange?.(dayjs(parsedDate));
        }
      }
    }
  };

  const handleBlur = () => {
    if (!(inputValue.length === 0 || (inputValue.length === 10 && validateDate(inputValue)))) {
      setInputValue("");
      onChange?.(null);
    }
    setFocused(false);
  };

  const handleChangeDate = (fn: (date: Dayjs) => Dayjs) => {
    setInputValue((prev) => {
      const dateValue = prev.length > 0 ? dayjs(prev) : dayjs();
      const res = fn(dateValue);
      return res.format(dateTemplate);
    });
  };

  useEffect(() => {
    handleChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  const validateDate = (val: string) => {
    const parsedDate = new Date(val);
    if (!isNaN(parsedDate.getDate())) return parsedDate;
    return null;
  };

  const dayjsDate = useMemo(() => {
    if (inputValue.length === 10 && validateDate(inputValue)) return dayjs(inputValue, dateTemplate);
    return dayjs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  const pickerRef = useRef<HTMLDivElement | null>(null);

  useDetectOutsideClick(pickerRef, () => setPickerVisible(false));
  const { dimensions, icons } = useDataGridContext();

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
      <button
        className={cs("util-button", pickerVisible && "active")}
        onClick={() => setPickerVisible((prev) => !prev)}
      >
        <icons.Date className="input-icon" />
      </button>
      <Fade className="data-grid-dp main-wrapper" visible={pickerVisible}>
        <Picker
          ref={pickerRef}
          dateAttrs={{
            setSelectedDate: handleChangeDate,
            selectedDate: dayjsDate,
          }}
          style={{
            top: dimensions.defaultHeaderFilterHeight - 15,
          }}
          pickerLocale={locale}
        />
      </Fade>
    </div>
  );
};

export default DatePicker;
