/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useRef, useState } from "react";
import { useDetectOutsideClick } from "../../../hooks/detectOutsideClick";
import ArrowLeft from "../../../icons/ArrowLeft";
import ArrowRight from "../../../icons/ArrowRight";
import Gear from "../../../icons/Gear";
import type { PaginationTableProps } from "../../../types/Utils";
import { concatStyles } from "../../../utils/ConcatStyles";
import Fade from "../../animations/Fade/Fade";
import { SettingsMenu } from "../SettingsMenu/SettingsMenu";
import "./PaginationTable.css";

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
  settingsMenuProps,
  changeColumnVisibility,
  ...props
}: PaginationTableProps & React.HTMLAttributes<HTMLDivElement>) {
  const DEFAULT_PAGE_SIZES = paginationDefaults?.pageSizes ?? ([5, 10, 20, 50, 100] as const);

  const [settingsMenuVisible, setSettingsMenuVisible] = useState<boolean>(false);
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
        className={"page-size-selector"}
        defaultValue={paginationProps.pageSize}
        onChange={(e) => updatePaginationProps({ currentPage: 1, pageSize: +e.target.value })}
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
        <span className={"title"}>{localization.paginationTotalCount} :&nbsp;</span>
        <span className={"data-count"}>{paginationProps.dataCount}</span>
      </>
    ),
    [paginationProps.dataCount]
  );

  const settingsMenuRef = useRef<HTMLDivElement | null>(null);

  useDetectOutsideClick(
    [
      {
        key: "settingsMenu",
        ref: settingsMenuRef,
      },
    ],
    (_, key) => setSettingsMenuVisible(false)
  );

  const renderSettingsMenu = useMemo(() => {
    return (
      <Fade visible={settingsMenuVisible}>
        <SettingsMenu ref={settingsMenuRef} {...settingsMenuProps} />
      </Fade>
    );
  }, [settingsMenuProps, settingsMenuVisible]);

  return (
    <div className={concatStyles("pagination-table", className)} {...props}>
      <Fade>
        <div className={"bottom"}>
          <div className={"pagination-data-count"}>
            {changeColumnVisibility && (
              <div className={"settings"}>
                <button
                  type="button"
                  title="Settings"
                  onClick={() => setSettingsMenuVisible((prev) => !prev)}
                  className={"settings-button"}
                >
                  <Gear className={"settings-icon"} />
                </button>
              </div>
            )}
            {changeColumnVisibility && renderSettingsMenu}
            {renderDataCount}
          </div>
          <div className={"pagination-page-numbers"}>{renderPaginationNumbers}</div>
          <div className={"pagination-page-size"}>{renderPaginationPageSize}</div>
        </div>
      </Fade>
    </div>
  );
}

function renderPaginationButtons({
  paginationProps,
  updatePaginationProps,
  onPaginationChange,
  localization,
}: Omit<PaginationTableProps, "fetching" | "settingsMenuProps" | "changeColumnVisibility">) {
  function renderButton({ navigateTo, component, disabled, title }: RenderPaginationButtonProps) {
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
        className={concatStyles(isActive && "active", "pagination-button")}
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

    const buttonCount = Math.ceil(paginationProps.dataCount / paginationProps.pageSize);
    if (paginationProps.currentPage! > buttonCount) updatePaginationProps({ currentPage: buttonCount }, false);

    const initialPageNumber = 1;

    const prev1 = paginationProps.currentPage! - 1;
    const prev2 = paginationProps.currentPage! - 2;

    const next1 = paginationProps.currentPage! + 1;
    const next2 = paginationProps.currentPage! + 2;

    buttons.push(initialPageNumber);
    if (prev2 !== initialPageNumber && prev2 > 0) buttons.push(prev2);
    if (prev1 !== initialPageNumber && prev1 > 0) buttons.push(prev1);

    if (paginationProps.currentPage !== buttonCount && paginationProps.currentPage !== initialPageNumber)
      buttons.push(paginationProps.currentPage!);

    if (buttonCount > next1) buttons.push(next1);
    if (buttonCount > next2) buttons.push(next2);

    buttonCount !== initialPageNumber && buttons.push(buttonCount);

    return [
      renderButton({
        navigateTo: prev1,
        component: <ArrowLeft className={"arrow-icon"} />,
        disabled: prev1 === 0,
        title: localization.paginationPrev,
      }),
      ...buttons.map((num) => renderButton({ navigateTo: num })),
      renderButton({
        navigateTo: next1,
        component: <ArrowRight className={"arrow-icon"} />,
        disabled: next1 > buttonCount,
        title: localization.paginationNext,
      }),
    ];
  }
}
