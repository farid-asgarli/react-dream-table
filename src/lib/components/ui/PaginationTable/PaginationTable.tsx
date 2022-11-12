/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from "react";
import ArrowLeft from "../../../icons/ArrowLeft";
import ArrowRight from "../../../icons/ArrowRight";
import type { PaginationTableProps } from "../../../types/Utils";
import { concatStyles } from "../../../utils/ConcatStyles";
import Fade from "../../animations/Fade/Fade";
import styles from "./PaginationTable.module.css";

interface RenderPaginationButtonProps {
  navigateTo: number;
  component?: React.ReactNode;
  disabled?: boolean;
  title?: string;
}

export function PaginationTable({
  paginationProps,
  updatePaginationProps,
  onPaginationChange,
  localization,
  paginationDefaults,
  className,
  ...props
}: PaginationTableProps & React.HTMLAttributes<HTMLDivElement>) {
  const DEFAULT_PAGE_SIZES =
    paginationDefaults?.pageSizes ?? ([5, 10, 20, 50, 100] as const);

  const renderPaginationNumbers = useMemo(
    () =>
      renderPaginationButtons({
        paginationProps,
        updatePaginationProps,
        onPaginationChange,
        localization,
      }),

    [paginationProps, updatePaginationProps]
  );
  const renderPaginationPageSize = useMemo(
    () => (
      <select
        title={localization.paginationPageSize}
        className={styles.PageSizeSelector}
        defaultValue={paginationProps.pageSize}
        onChange={(e) =>
          updatePaginationProps({ currentPage: 1, pageSize: +e.target.value })
        }
      >
        {DEFAULT_PAGE_SIZES.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
    ),
    [paginationProps.pageSize]
  );

  const renderDataCount = useMemo(
    () => (
      <>
        <span className={styles.Title}>
          {localization.paginationTotalCount} :&nbsp;
        </span>
        <span className={styles.DataCount}>{paginationProps.dataCount}</span>
      </>
    ),
    [paginationProps.dataCount]
  );

  return (
    <table
      className={concatStyles(styles.PaginationTable, className)}
      {...props}
    >
      <tfoot>
        <tr>
          <th>
            <Fade>
              <div className={styles.Bottom}>
                <div className={styles.PaginationDataCount}>
                  {renderDataCount}
                </div>
                <div className={styles.PaginationPageNumbers}>
                  {renderPaginationNumbers}
                </div>
                <div className={styles.PaginationPageSize}>
                  {renderPaginationPageSize}
                </div>
              </div>
            </Fade>
          </th>
        </tr>
      </tfoot>
    </table>
  );
}

function renderPaginationButtons({
  paginationProps,
  updatePaginationProps,
  onPaginationChange,
  localization,
  paginationDefaults,
}: Omit<PaginationTableProps, "fetching">) {
  function renderButton({
    navigateTo,
    component,
    disabled,
    title,
  }: RenderPaginationButtonProps) {
    const isActive = paginationProps.currentPage === navigateTo;

    function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
      !isActive &&
        updatePaginationProps({
          currentPage: navigateTo,
        });
    }

    return (
      <button
        title={title ?? `${navigateTo}`}
        type="button"
        className={concatStyles(
          isActive && styles.Active,
          styles.PaginationButton
        )}
        onClick={handleClick}
        disabled={isActive || disabled === true}
        key={component ? navigateTo + "arrow" : navigateTo}
      >
        <span>{component ?? navigateTo}</span>
      </button>
    );
  }

  if (paginationProps.pageSize && paginationProps.dataCount) {
    onPaginationChange?.(paginationProps);

    const buttons: number[] = [];

    const buttonCount = Math.ceil(
      paginationProps.dataCount / paginationProps.pageSize
    );
    if (paginationProps.currentPage! > buttonCount)
      updatePaginationProps({ currentPage: buttonCount }, false);

    const initialPageNumber = 1;

    const prev1 = paginationProps.currentPage! - 1;
    const prev2 = paginationProps.currentPage! - 2;

    const next1 = paginationProps.currentPage! + 1;
    const next2 = paginationProps.currentPage! + 2;

    buttons.push(initialPageNumber);
    if (prev2 !== initialPageNumber && prev2 > 0) buttons.push(prev2);
    if (prev1 !== initialPageNumber && prev1 > 0) buttons.push(prev1);

    if (
      paginationProps.currentPage !== buttonCount &&
      paginationProps.currentPage !== initialPageNumber
    )
      buttons.push(paginationProps.currentPage!);

    if (buttonCount > next1) buttons.push(next1);
    if (buttonCount > next2) buttons.push(next2);

    buttonCount !== initialPageNumber && buttons.push(buttonCount);

    return [
      renderButton({
        navigateTo: prev1,
        component: <ArrowLeft className={styles.ArrowIcon} />,
        disabled: prev1 === 0,
        title: localization.paginationPrev,
      }),
      ...buttons.map((num) => renderButton({ navigateTo: num })),
      renderButton({
        navigateTo: next1,
        component: <ArrowRight className={styles.ArrowIcon} />,
        disabled: next1 > buttonCount,
        title: localization.paginationNext,
      }),
    ];
  }
}
