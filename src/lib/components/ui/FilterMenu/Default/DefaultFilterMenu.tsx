/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTableContext } from "../../../../context/TableContext";
import { StringExtensions } from "../../../../extensions/String";
import Close from "../../../../icons/Close";
import NoResult from "../../../../icons/NoResult";
import { FilterMenuProps } from "../../../../types/Utils";
import { concatStyles } from "../../../../utils/ConcatStyles";
import Fade from "../../../animations/Fade/Fade";
import Spinner from "../../Spinner/Spinner";
import "./DefaultFilterMenu.css";
export const DefaultFilterMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & FilterMenuProps
>(
  (
    {
      visible,
      fetchedFilter,
      updateSelectedFilters,
      columnKey,
      onHide,
      updateInputValue,
      value,
      selectedFilters,
      isServerSide,
      loading,
      className,
      currentColumn,
      style,
      ...props
    },
    ref
  ) => {
    const { localization, elementStylings } = useTableContext();

    const [currentInputValue, setCurrentInputValue] = useState<string | undefined>(value ?? StringExtensions.Empty);

    const columnFilteringProps = currentColumn?.filteringProps?.default;

    const inputRef = useRef<HTMLInputElement>(null);
    const inputUpdateTimeout = useRef<NodeJS.Timeout | null>(null);
    function clearUpdateTimeout() {
      if (inputUpdateTimeout.current) clearTimeout(inputUpdateTimeout.current);
      inputUpdateTimeout.current = null;
    }

    useEffect(() => {
      inputRef.current?.focus();
      return () => {
        clearUpdateTimeout();
      };
    }, []);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
      setCurrentInputValue(e.target.value);
      clearUpdateTimeout();
      inputUpdateTimeout.current = setTimeout(async () => {
        updateInputValue(columnKey, e.target.value);
      }, 600);
    }

    function clearInput() {
      setCurrentInputValue(StringExtensions.Empty);
      updateInputValue(columnKey, StringExtensions.Empty);
    }

    const displaySelectedFilters = useMemo(() => {
      if (!selectedFilters) return [];
      return Array.from(selectedFilters).map((x) => (
        <li className={"filter-element active"} onClick={() => updateSelectedFilters(columnKey, `${x}`)} key={x}>
          <div className="select-button" title={x}>
            <div className="content">
              <span>{columnFilteringProps?.render ? columnFilteringProps?.render(x) : x}</span>
            </div>
            <button className="remove-button">
              <Close className={"close-icon"} />
            </button>
          </div>
        </li>
      ));
    }, [selectedFilters]);

    const mapFilters = useMemo(
      () => {
        if (loading)
          return (
            <Fade>
              <li className={"loading-wrapper"}>
                <Spinner size={24} />
                <span>{localization.filterLoading}</span>
              </li>
            </Fade>
          );

        const filters = fetchedFilter[columnKey]?.filter((x) => {
          if (selectedFilters?.has(x)) return false;
          if (isServerSide || !value) return true;

          if (columnFilteringProps?.searchEqualityComparer) {
            return columnFilteringProps?.searchEqualityComparer(value, x);
          } else {
            let inputValue = `${value}`.toLocaleLowerCase();
            return x.toLowerCase().includes(inputValue);
          }
        });

        if (filters?.length === 0 && (!selectedFilters || selectedFilters?.size === 0))
          return (
            <Fade>
              <li className={"no-result"}>
                <NoResult className={"no-result-icon"} />
                <span>{localization.filterEmpty}</span>
              </li>
            </Fade>
          );

        return filters?.map((x) => (
          <li className={concatStyles("filter-element")} key={x}>
            <div className="select-button" onClick={() => updateSelectedFilters(columnKey, `${x}`)} title={x}>
              <span className="content"> {columnFilteringProps?.render ? columnFilteringProps?.render(x) : x}</span>
            </div>
          </li>
        ));
      },
      //fetchedFilter added as a result of server rendering

      [value, selectedFilters, fetchedFilter]
    );

    return (
      <Fade onAnimationFinish={onHide} duration={200} visible={visible}>
        <div
          ref={ref}
          className={concatStyles("search-wrapper", className)}
          style={{ ...style, ...elementStylings?.filterMenu?.style }}
          {...props}
        >
          <div className={"search-input-wrapper"}>
            <input
              key={columnKey}
              placeholder={localization.defaultFilterSearchPlaceholder}
              onChange={handleInputChange}
              value={currentInputValue}
              ref={inputRef}
              {...columnFilteringProps?.searchInputProps?.(columnKey)}
            />
            <button
              type="button"
              className={"clear-button"}
              onClick={clearInput}
              disabled={!(currentInputValue && currentInputValue.length > 0)}
            >
              <Close className={"clear-icon"} />
            </button>
          </div>
          <div className={"filter-container"}>
            <ul>
              {displaySelectedFilters}
              {mapFilters}
            </ul>
          </div>
          <div className={"bottom"}>
            <button
              disabled={!selectedFilters || selectedFilters?.size === 0}
              onClick={() => updateSelectedFilters(columnKey)}
              className={"reset-button"}
            >
              <span>{localization.filterReset}</span>
            </button>
          </div>
        </div>
      </Fade>
    );
  }
);
