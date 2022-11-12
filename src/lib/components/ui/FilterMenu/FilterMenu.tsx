import React, { useEffect, useMemo, useRef, useState } from "react";
import Close from "../../../icons/Close";
import NoResult from "../../../icons/NoResult";
import { FilterMenuProps } from "../../../types/Utils";
import { concatStyles } from "../../../utils/ConcatStyles";
import Fade from "../../animations/Fade/Fade";
import Spinner from "../Spinner/Spinner";
import styles from "./FilterMenu.module.css";
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
      ...props
    },
    ref
  ) => {
    const [currentInputValue, setCurrentInputValue] = useState<
      string | undefined
    >(value ?? "");

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
      setCurrentInputValue("");
      updateInputValue(columnKey, "");
    }

    const displaySelectedFilters = useMemo(() => {
      if (!selectedFilters) return [];
      return Array.from(selectedFilters).map((x) => (
        <li
          className={concatStyles(styles.FilterElement, styles.Active)}
          onClick={() => updateSelectedFilters(columnKey, `${x}`)}
          key={x}
        >
          <button type="button" title={x}>
            <span>{x}</span>
            <Fade className={styles.CloseIconWrapper}>
              <Close className={styles.CloseIcon} />
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
              <li className={styles.LoadingWrapper}>
                <Spinner size={24} />
                <span>{localization.filterLoading}</span>
              </li>
            </Fade>
          );

        const filters = fetchedFilter.get(columnKey)?.filter((x) => {
          if (selectedFilters?.has(x)) return false;
          if (isServerSide || !value) return true;
          let inputValue = `${value}`.toLocaleLowerCase();
          return x.toLowerCase().includes(inputValue);
        });

        if (
          filters?.length === 0 &&
          (!selectedFilters || selectedFilters?.size === 0)
        )
          return (
            <Fade>
              <li className={styles.NoResult}>
                <NoResult className={styles.NoResultIcon} />
                <span>{localization.filterEmpty}</span>
              </li>
            </Fade>
          );

        return filters?.map((x) => (
          <li
            className={concatStyles(styles.FilterElement)}
            onClick={() => updateSelectedFilters(columnKey, `${x}`)}
            key={x}
          >
            <button>{x}</button>
          </li>
        ));
      },
      //fetchedFilter added as a result of server rendering

      [value, selectedFilters, fetchedFilter]
    );

    return (
      <Fade
        onAnimationFinish={onHide}
        className={styles.ContextAnimator}
        visible={visible}
      >
        <div
          ref={ref}
          className={concatStyles(styles.SearchWrapper, className)}
          {...props}
        >
          <div className={styles.SearchInputWrapper}>
            <input
              key={columnKey}
              placeholder={localization.filterSearchPlaceholder}
              onChange={handleInputChange}
              value={currentInputValue}
            />

            <button
              type="button"
              onClick={clearInput}
              className={styles.ClearButton}
              disabled={!(currentInputValue && currentInputValue.length > 0)}
            >
              <Close className={styles.ClearIcon} />
            </button>
          </div>
          <div className={styles.FilterContainer}>
            <ul>
              {displaySelectedFilters}
              {mapFilters}
            </ul>
          </div>
          <div className={styles.Bottom}>
            <button
              disabled={!selectedFilters || selectedFilters?.size === 0}
              onClick={() => updateSelectedFilters(columnKey)}
              className={styles.ResetButton}
            >
              <span>{localization.filterReset}</span>
            </button>
          </div>
        </div>
      </Fade>
    );
  }
);
