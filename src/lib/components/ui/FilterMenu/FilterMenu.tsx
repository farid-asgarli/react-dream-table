import React, { useMemo } from "react";
import { useDataGridStaticContext } from "../../../context/DataGridStaticContext";
import { ConstProps } from "../../../static/constantProps";
import { FilteringProps } from "../../../types/Utils";
import Fade from "../../animations/Fade/Fade";
import DatePicker from "../DatePicker/Input/Input";
import Input from "../Input/Input";
import { Select } from "../Select/Select";
import "./FilterMenu.css";
// import Select from "react-select";

export default function FilterMenu({
  filterProps: {
    getColumnFilterValue,
    progressReporters,
    updateFilterValue,
    fetchFilters,
    multiple,
    prefetchedFilters,
    render,
    renderCustomInput,
    filterInputProps,
    type,
    isRangeInput,
    disableInputIcon,
    pickerLocale,
  },
  columnKey,
}: {
  columnKey: string;
  filterProps: FilteringProps;
}) {
  const { localization } = useDataGridStaticContext();

  function handleInputChange(value: any, index?: number) {
    if (index !== undefined) {
      const currentFilterValue = getColumnFilterValue(columnKey);
      let filterValueToAssign = Array.isArray(currentFilterValue) ? [...currentFilterValue] : [currentFilterValue];
      filterValueToAssign[index] = value;
      updateFilterValue?.(columnKey, filterValueToAssign);
    } else {
      updateFilterValue?.(columnKey, value);
    }
  }
  const renderOptions = useMemo(() => {
    if (render) {
      return prefetchedFilters?.[columnKey]?.map((x) => ({
        children: render?.(x),
        value: x,
      }));
    }
    return prefetchedFilters?.[columnKey]?.map((x) => ({
      children: x,
      value: x,
    }));
  }, [columnKey, prefetchedFilters, render]);

  const renderInput = (variant: typeof type, rangeIndex?: number | undefined) => {
    const rangeInputProps = {
      ...filterInputProps?.(columnKey),
      onChange: (val: any) => handleInputChange(val, rangeIndex),
      defaultValue: getColumnFilterValue(columnKey)?.[rangeIndex ?? 0],
    };
    const basicInputProps = {
      ...filterInputProps?.(columnKey),
      onChange: handleInputChange,
      defaultValue: getColumnFilterValue(columnKey),
    };

    const renderProps = rangeIndex !== undefined ? rangeInputProps : basicInputProps;

    switch (variant) {
      case "date":
        return (
          <DatePicker
            locale={pickerLocale ?? ConstProps.defaultPickerLocale}
            placeholder={localization.filterDatePlaceholder}
            {...renderProps}
          />
        );

      case "number":
        return <Input type="number" disableIcon={disableInputIcon} placeholder={localization.filterInputPlaceholder} {...renderProps} />;
      case "select":
        return (
          <Select
            loading={progressReporters?.has("filter-fetch")}
            value={(getColumnFilterValue(columnKey) as any) ?? []}
            multiple={multiple}
            options={renderOptions ?? []}
            clearable
            onChange={(val: any) => updateFilterValue?.(columnKey, val)}
            onOpen={() => fetchFilters?.(columnKey)}
            attachmentType="fixed"
          />
        );
      default:
        return <Input disableIcon={disableInputIcon} placeholder={localization.filterInputPlaceholder} {...renderProps} />;
    }
  };

  return (
    <div className="filter-menu">
      {renderCustomInput ? (
        isRangeInput ? (
          <div className="range-input">
            {renderCustomInput(updateFilterValue, getColumnFilterValue(columnKey), 0)}
            {renderCustomInput(updateFilterValue, getColumnFilterValue(columnKey), 1)}
          </div>
        ) : (
          renderCustomInput(updateFilterValue, getColumnFilterValue(columnKey), 0)
        )
      ) : isRangeInput ? (
        <Fade>
          <div className="range-input">
            {renderInput(type, 0)}
            {renderInput(type, 1)}
          </div>
        </Fade>
      ) : (
        renderInput(type)
      )}
    </div>
  );
}
