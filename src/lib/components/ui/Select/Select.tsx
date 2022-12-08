import React, { HTMLAttributes, useRef, useState } from "react";
import { useDetectOutsideClick } from "../../../hooks/detectOutsideClick";
import CheckMarkIcon from "../../../icons/CheckMark";
import ChevronDownIcon from "../../../icons/ChevronDown";
import ChevronUpIcon from "../../../icons/ChevronUp";
import Fade from "../../animations/Fade/Fade";
import { concatStyles } from "../../../utils/ConcatStyles";
import "./Select.css";

type ConditionalProps<OptionValue> =
  | {
      multiple: false;
      value: OptionValue;
      onChange?: (val: OptionValue) => void;
    }
  | {
      multiple: true;
      value: Set<OptionValue>;
      onChange?: (val: Set<OptionValue>) => void;
    }
  | {
      multiple?: undefined;
      value: OptionValue;
      onChange?: (val: OptionValue) => void;
    };

type TableSelectProps<OptionValue> = ConditionalProps<OptionValue> & {
  options: {
    value: OptionValue;
    children: React.ReactNode;
  }[];
};

type TableSelectOption<OptionValue> = HTMLAttributes<HTMLDivElement> & { value: OptionValue; children: React.ReactNode };

export const Select = <OptionValue extends any>({ options, value, onChange, multiple }: TableSelectProps<OptionValue>) => {
  const [optionsBodyVisible, setOptionsBodyVisible] = useState<boolean>(false);
  function handleSelectChange(val: OptionValue) {
    if (!multiple) {
      onChange?.(val as any);
      setOptionsBodyVisible(false);
    } else {
      const stateCopy = new Set(value);
      if (stateCopy.has(val)) stateCopy.delete(val);
      else stateCopy.add(val);
      onChange?.(stateCopy);
      return stateCopy;
    }
  }

  const optionBodyRef = useRef<HTMLDivElement>(null);

  useDetectOutsideClick([{ key: "select", ref: optionBodyRef }], (e, key) => setOptionsBodyVisible(false));

  return (
    <div className="select-wrapper">
      <div
        className={concatStyles("select-header", optionsBodyVisible && "active")}
        onClick={() => {
          if (!optionsBodyVisible) setOptionsBodyVisible(true);
        }}
      >
        <div className="selected-value">{options.filter((x) => (multiple ? value.has(x.value) : x.value === value)).map((x) => x.children)}</div>
        <div className="select-icon-wrapper">
          {optionsBodyVisible ? <ChevronUpIcon className="select-icon" /> : <ChevronDownIcon className="select-icon" />}
        </div>
      </div>
      <Fade visible={optionsBodyVisible}>
        <div ref={optionBodyRef} className="select-list-wrapper">
          {options.map((opt) => (
            <Select.Option
              key={opt.value as string}
              {...opt}
              selected={multiple ? value.has(opt.value) : opt.value === value}
              onClick={() => handleSelectChange(opt.value)}
            />
          ))}
        </div>
      </Fade>
    </div>
  );
};

Select.Option = <OptionValue extends any>({
  title,
  value,
  className,
  children,
  selected,
  ...props
}: TableSelectOption<OptionValue> & {
  selected?: boolean;
}) => {
  return (
    <div className={concatStyles("select-option", selected && "selected", className)} {...props}>
      {children}
      {selected && (
        <div className="select-option-icon">
          <CheckMarkIcon className="select-option-check-icon" />
        </div>
      )}
    </div>
  );
};
