/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { StringExtensions } from "../../../extensions/String";
import Close from "../../../icons/Close";
import NoResult from "../../../icons/NoResult";
import { FilterMenuProps } from "../../../types/Utils";
import { concatStyles } from "../../../utils/ConcatStyles";
import Fade from "../../animations/Fade/Fade";
import Spinner from "../Spinner/Spinner";
import "./FilterMenu.css";
export const FilterMenu = React.forwardRef<
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
      localization,
      className,
      currentColumn,
      ...props
    },
    ref
  ) => {
    const [currentInputValue, setCurrentInputValue] = useState<
      string | undefined
    >(value ?? StringExtensions.Empty);

    const inputUpdateTimeout = useRef<NodeJS.Timeout | null>(null);
    function clearUpdateTimeout() {
      if (inputUpdateTimeout.current) clearTimeout(inputUpdateTimeout.current);
      inputUpdateTimeout.current = null;
    }

    useEffect(() => {
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
        <li
          className={"filter-element active"}
          onClick={() => updateSelectedFilters(columnKey, `${x}`)}
          key={x}
        >
          <button type="button" title={x}>
            <span>
              {currentColumn?.filterRender ? currentColumn.filterRender(x) : x}
            </span>
            <Fade className={"close-icon-wrapper"}>
              <Close className={"close-icon"} />
            </Fade>
          </button>
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

        const filters = fetchedFilter.get(columnKey)?.filter((x) => {
          if (selectedFilters?.has(x)) return false;
          if (isServerSide || !value) return true;

          if (currentColumn?.filterSearchEqualityComparer) {
            return currentColumn.filterSearchEqualityComparer(value, x);
          } else {
            let inputValue = `${value}`.toLocaleLowerCase();
            return x.toLowerCase().includes(inputValue);
          }
        });

        if (
          filters?.length === 0 &&
          (!selectedFilters || selectedFilters?.size === 0)
        )
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
            <button
              onClick={() => updateSelectedFilters(columnKey, `${x}`)}
              type="button"
              title={x}
            >
              {currentColumn?.filterRender ? currentColumn.filterRender(x) : x}
            </button>
          </li>
        ));
      },
      //fetchedFilter added as a result of server rendering

      [value, selectedFilters, fetchedFilter]
    );

    return (
      <Fade
        onAnimationFinish={onHide}
        className={"context-animator"}
        visible={visible}
      >
        <div
          ref={ref}
          className={concatStyles("search-wrapper", className)}
          {...props}
        >
          <div className={"search-input-wrapper"}>
            <input
              key={columnKey}
              placeholder={localization.filterSearchPlaceholder}
              onChange={handleInputChange}
              value={currentInputValue}
              {...currentColumn?.filterSearchInputProps?.(columnKey)}
            />

            <button
              type="button"
              onClick={clearInput}
              className={"clear-button"}
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
