import React, { HTMLAttributes, useMemo, useRef, useState } from "react";
import { useDetectOutsideClick } from "../../../hooks/use-detect-outside-click/use-detect-outside-click";
import Fade from "../../animations/Fade/Fade";
import { cs } from "../../../utils/ConcatStyles";
import "./Select.css";
import Spinner from "../Spinner/Spinner";
import { useDataGridStaticContext } from "../../../context/DataGridStaticContext";

type ConditionalProps<OptionValue> =
  | {
      multiple: false;
      value: OptionValue;
      onChange?: (val: OptionValue) => void;
    }
  | {
      multiple: true;
      value: Array<OptionValue>;
      onChange?: (val: Array<OptionValue>) => void;
    }
  | {
      multiple?: undefined;
      value: OptionValue;
      onChange?: (val: OptionValue) => void;
    };

type DataGridSelectProps<OptionValue> = ConditionalProps<OptionValue> & {
  options: {
    value: OptionValue;
    children: React.ReactNode;
  }[];
  onOpen?: () => void;
  clearable?: boolean | undefined;
  loading?: boolean | undefined;
  attachmentType?: "fixed" | "absolute" | undefined;
};

type DataGridSelectOption<OptionValue> = HTMLAttributes<HTMLDivElement> & {
  value: OptionValue;
  children: React.ReactNode;
  checkIcon(props: React.SVGProps<SVGSVGElement>): JSX.Element;
};

export const Select = <OptionValue extends any>({
  options,
  value,
  onChange,
  onOpen,
  multiple,
  clearable,
  loading,
  attachmentType,
}: DataGridSelectProps<OptionValue>) => {
  const [optionsBodyVisible, setOptionsBodyVisible] = useState<boolean>(false);
  const { localization, icons } = useDataGridStaticContext();

  function handleSelectChange(val: OptionValue) {
    if (!multiple) {
      if (clearable && val === value) {
        onChange?.(undefined as any);
        setOptionsBodyVisible(false);
      } else {
        onChange?.(val as any);
        setOptionsBodyVisible(false);
      }
    } else {
      let stateCopy = [...value];
      if (stateCopy.includes(val)) stateCopy = stateCopy.filter((x) => x !== val);
      else stateCopy.push(val);
      onChange?.(stateCopy);
      return stateCopy;
    }
  }

  function handleVisibility(e: React.MouseEvent<HTMLDivElement>) {
    if (!optionsBodyVisible) {
      setOptionsBodyVisible(true);
      onOpen?.();
    }
  }

  const optionBodyRef = useRef<HTMLDivElement>(null);
  const selectWrapperRef = useRef<HTMLDivElement>(null);

  useDetectOutsideClick(optionBodyRef, (e, key) => setOptionsBodyVisible(false));

  function joinNodes(args: React.ReactNode[]) {
    const isPunctuationActive = typeof args[0] === "string";
    return args.map((arg, index) => (
      <span key={index}>
        {arg}
        {isPunctuationActive && args.length - 1 !== index && <span>,&nbsp;</span>}
      </span>
    ));
  }

  const renderSelectedValues = useMemo(() => {
    const elements = options.filter((x) => (multiple ? value.includes(x.value) : x.value === value)).map((x) => x.children);
    if (elements.length === 0) return <span className="select-placeholder">{localization.selectPlaceholder}</span>;
    return joinNodes(elements);
  }, [localization.selectPlaceholder, multiple, options, value]);

  return (
    <div ref={selectWrapperRef} className="select-wrapper">
      <div className={cs("select-header", optionsBodyVisible && "active")} onClick={handleVisibility}>
        <div className="selected-value">{renderSelectedValues}</div>
        <div className="select-icon-wrapper">
          {optionsBodyVisible ? <icons.ChevronUp className="select-icon" /> : <icons.ChevronDown className="select-icon" />}
        </div>
      </div>
      <Fade visible={optionsBodyVisible}>
        <div
          ref={optionBodyRef}
          style={{
            width: selectWrapperRef.current?.clientWidth,
          }}
          className={cs("select-list-wrapper", attachmentType)}
        >
          {loading === true ? (
            <div className="loading-wrapper">
              <Spinner size={24} />
              <span>{localization.selectOptionsLoading}</span>
            </div>
          ) : (
            options.map((opt) => (
              <Select.Option
                key={opt.value as string}
                {...opt}
                selected={multiple ? value.includes(opt.value) : opt.value === value}
                onClick={() => handleSelectChange(opt.value)}
                checkIcon={icons.CheckMark}
              />
            ))
          )}
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
  checkIcon: CheckIcon,
  ...props
}: DataGridSelectOption<OptionValue> & {
  selected?: boolean;
}) => {
  return (
    <div className={cs("select-option", selected && "selected", className)} {...props}>
      {children}
      {selected && (
        <div className="select-option-icon">
          <CheckIcon className="select-option-check-icon" />
        </div>
      )}
    </div>
  );
};
