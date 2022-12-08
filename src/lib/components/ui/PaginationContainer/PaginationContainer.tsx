/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useRef, useState } from "react";
import { useTableContext } from "../../../context/TableContext";
import { useDetectOutsideClick } from "../../../hooks/detectOutsideClick";
import ArrowLeft from "../../../icons/ArrowLeft";
import ArrowRight from "../../../icons/ArrowRight";
import Gear from "../../../icons/Gear";
import { TableLocalizationType } from "../../../types/Table";
import type { PaginationContainerProps } from "../../../types/Utils";
import { concatStyles } from "../../../utils/ConcatStyles";
import Fade from "../../animations/Fade/Fade";
import { Select } from "../Select/Select";
import { SettingsMenu } from "../SettingsMenu/SettingsMenu";
import "./PaginationContainer.css";

interface RenderPaginationButtonProps {
  navigateTo: number;
  component?: React.ReactNode;
  disabled?: boolean;
  title?: string;
}

export function PaginationContainer({
  paginationProps,
  updatePaginationProps,
  onPaginationChange,
  className,
  style,
  settingsMenuProps,
  progressReporters,
  changeColumnVisibility,
  selectedRows,
  loading,
  ...props
}: PaginationContainerProps & React.HTMLAttributes<HTMLDivElement>) {
  const { localization, elementStylings, paginationDefaults } = useTableContext();

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
      <Select
        onChange={(e) => updatePaginationProps({ currentPage: 1, pageSize: e })}
        options={DEFAULT_PAGE_SIZES.map((op) => ({
          children: op,
          value: op,
        }))}
        value={paginationProps.pageSize}
      />
    ),
    [paginationProps.pageSize]
  );

  const renderDataCount = useMemo(
    () =>
      selectedRows.size > 0 ? (
        <div className="selected-data-count">
          <Fade key={selectedRows.size}>
            <span className="data-count">{selectedRows.size}&nbsp;</span>
          </Fade>
          <span className="title">{localization.rowsSelectedTitle}</span>
        </div>
      ) : (
        <div className="total-data-count">
          <Fade key={paginationProps.dataCount}>
            <span className="data-count">{paginationProps.dataCount}&nbsp;</span>
          </Fade>
          <span className="title">{localization.paginationTotalCount}</span>
        </div>
      ),
    [paginationProps.dataCount, selectedRows]
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

  return (
    <div
      className={concatStyles("pagination-container", elementStylings?.tableFoot?.className, className)}
      style={{
        ...style,
        ...elementStylings?.tableBody?.style,
      }}
      {...props}
    >
      <Fade>
        <div className={"bottom"}>
          <div className={"pagination-data-count"}>
            {changeColumnVisibility && (
              <div className={"settings"}>
                <button
                  type="button"
                  title={localization.columnVisibilityTitle}
                  onClick={() => setSettingsMenuVisible((prev) => !prev)}
                  className={concatStyles("settings-button", settingsMenuVisible && "active")}
                >
                  <Gear className={"settings-icon"} />
                </button>
              </div>
            )}
            {changeColumnVisibility && (
              <SettingsMenu ref={settingsMenuRef} visible={settingsMenuVisible} {...settingsMenuProps} />
            )}
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
}: {
  paginationProps: PaginationContainerProps["paginationProps"];
  updatePaginationProps: PaginationContainerProps["updatePaginationProps"];
  onPaginationChange: PaginationContainerProps["onPaginationChange"];
  localization: TableLocalizationType;
}) {
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

    const next1 = paginationProps.currentPage! + 1;

    buttons.push(initialPageNumber);
    if (prev1 !== initialPageNumber && prev1 > 0) buttons.push(prev1);

    if (paginationProps.currentPage !== buttonCount && paginationProps.currentPage !== initialPageNumber)
      buttons.push(paginationProps.currentPage!);

    if (buttonCount > next1) buttons.push(next1);

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
