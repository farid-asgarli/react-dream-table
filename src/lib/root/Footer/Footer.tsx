/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useRef } from "react";
import Fade from "../../components/animations/Fade/Fade";
import { Select } from "../../components/ui/Select/Select";
import Skeleton from "../../components/ui/Skeleton/Skeleton";
import { useTableContext } from "../../context/TableContext";
import { useDetectOutsideClick } from "../../hooks/use-detect-outside-click/use-detect-outside-click";
import { TableIconsType, TableLocalizationType } from "../../types/Table";
import type { FooterProps } from "../../types/Utils";
import { cs } from "../../utils/ConcatStyles";
import "./Footer.css";

interface RenderPaginationButtonProps {
  navigateTo: number;
  component?: React.ReactNode;
  disabled?: boolean;
  title?: string;
  type?: "numeric" | "ff-left" | "ff-right";
  icons: TableIconsType;
}

export default function Footer<DataType>({
  paginationProps,
  updatePaginationProps,
  onPaginationChange,
  className,
  settingsMenu,
  progressReporters,
  columnVisibilityOptions,
  selectedRows,
  loading,
  style,
  ...props
}: FooterProps<DataType> & React.HTMLAttributes<HTMLDivElement>) {
  const { localization, dimensions, paginationDefaults, icons } = useTableContext();

  const DEFAULT_PAGE_SIZES = paginationDefaults?.pageSizes ?? ([5, 10, 20, 50, 100] as const);

  const renderPaginationNumbers = useMemo(
    () =>
      renderPaginationButtons({
        paginationProps,
        updatePaginationProps,
        onPaginationChange,
        localization,
        icons,
      }),

    [paginationProps, updatePaginationProps]
  );

  const renderPaginationPageSize = useMemo(
    () => (
      <Select
        onChange={(e) => updatePaginationProps({ currentPage: 1, pageSize: e })}
        options={DEFAULT_PAGE_SIZES.map((op: number) => ({
          children: op,
          value: op,
        }))}
        value={paginationProps.pageSize}
        attachmentType="fixed"
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
          {loading ? (
            <div style={{ width: 100 }}>
              <Skeleton />
            </div>
          ) : (
            <>
              <Fade key={paginationProps.dataCount}>
                <span className="data-count">{paginationProps.dataCount ?? 0}&nbsp;</span>
              </Fade>
              <span className="title">{localization.paginationTotalCount}</span>
            </>
          )}
        </div>
      ),
    [paginationProps.dataCount, selectedRows, loading]
  );

  const settingsMenuRef = useRef<HTMLDivElement | null>(null);

  useDetectOutsideClick(
    [
      {
        key: "settingsMenu",
        ref: settingsMenuRef,
      },
    ],
    (_, key) => settingsMenu.hideSettingsMenu()
  );

  return (
    <div
      className={cs("footer", className)}
      style={{ ...style, minHeight: dimensions.defaultFooterHeight, maxHeight: dimensions.defaultFooterHeight }}
      {...props}
    >
      <Fade>
        <div className={"bottom"}>
          <div className={"pagination-data-count"}>
            {columnVisibilityOptions?.active && (
              <div className={"settings"}>
                <button
                  type="button"
                  title={localization.columnVisibilityTitle}
                  onClick={(e) =>
                    settingsMenu.visibility?.visible
                      ? settingsMenu.hideSettingsMenu()
                      : settingsMenu.displaySettingsMenu(e)
                  }
                  className={cs("settings-button", settingsMenu.visibility?.visible && "active")}
                >
                  <icons.Gear className={"settings-icon"} />
                </button>
              </div>
            )}

            {renderDataCount}
          </div>
          <div className={"pagination-page-numbers"}>
            {loading ? (
              <div style={{ width: 300 }}>
                <Skeleton />
              </div>
            ) : (
              renderPaginationNumbers
            )}
          </div>
          <div className={"pagination-page-size"}>
            {loading ? (
              <div style={{ width: 100 }}>
                <Skeleton />
              </div>
            ) : (
              renderPaginationPageSize
            )}
          </div>
        </div>
      </Fade>
    </div>
  );
}

function renderPaginationButtons<DataType>({
  paginationProps,
  updatePaginationProps,
  onPaginationChange,
  localization,
  icons,
}: {
  paginationProps: FooterProps<DataType>["paginationProps"];
  updatePaginationProps: FooterProps<DataType>["updatePaginationProps"];
  onPaginationChange: FooterProps<DataType>["onPaginationChange"];
  localization: TableLocalizationType;
  icons: TableIconsType;
}) {
  function updateCurrentPage(navigateTo: number) {
    if (paginationProps.dataCount && paginationProps.pageSize) {
      const buttonCount = Math.ceil(paginationProps.dataCount / paginationProps.pageSize);
      if (navigateTo <= buttonCount && navigateTo >= 1)
        updatePaginationProps({
          currentPage: navigateTo,
        });
    }
  }

  function renderButton({ navigateTo, component, disabled, title, type, icons }: RenderPaginationButtonProps) {
    const isActive = paginationProps.currentPage === navigateTo;

    function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
      !isActive && updateCurrentPage(navigateTo);
    }

    return (
      <button
        title={title ?? `${navigateTo}`}
        type="button"
        className={cs(isActive && "active", "pagination-button", type)}
        onClick={handleClick}
        disabled={isActive || disabled === true}
        key={component ? navigateTo + "arrow" : navigateTo}
      >
        <span className="content">{component ?? navigateTo}</span>
        {type === "ff-left" ? (
          <span className="ff-swap">
            <icons.FastForward className="btn-icon" />{" "}
          </span>
        ) : type === "ff-right" ? (
          <span className="ff-swap">
            <icons.FastForward className="btn-icon" />{" "}
          </span>
        ) : null}
      </button>
    );
  }

  if (paginationProps.pageSize && paginationProps.dataCount) {
    onPaginationChange?.(paginationProps);

    const buttons: {
      type: "numeric" | "ff-left" | "ff-right";
      navigateTo: number;
    }[] = [];

    const buttonCount = Math.ceil(paginationProps.dataCount / paginationProps.pageSize);
    if (paginationProps.currentPage! > buttonCount) updateCurrentPage(buttonCount);

    const initialPageNumber = 1;
    const threeDotsDistance = 3;
    const threeDotsNavigationStep = 5;

    const prev1 = paginationProps.currentPage! - 1;

    const next1 = paginationProps.currentPage! + 1;

    buttons.push({
      navigateTo: initialPageNumber,
      type: "numeric",
    });

    if (paginationProps.currentPage! - threeDotsDistance >= 1)
      buttons.push({
        navigateTo: prev1 - (threeDotsNavigationStep - 1),
        type: "ff-left",
      });

    if (prev1 !== initialPageNumber && prev1 > 0)
      buttons.push({
        navigateTo: prev1,
        type: "numeric",
      });

    if (paginationProps.currentPage !== buttonCount && paginationProps.currentPage !== initialPageNumber)
      buttons.push({
        navigateTo: paginationProps.currentPage!,
        type: "numeric",
      });

    if (buttonCount > next1)
      buttons.push({
        navigateTo: next1,
        type: "numeric",
      });

    if (paginationProps.currentPage! + threeDotsDistance <= buttonCount)
      buttons.push({
        navigateTo: next1 + (threeDotsNavigationStep - 1),
        type: "ff-right",
      });

    buttonCount !== initialPageNumber &&
      buttons.push({
        navigateTo: buttonCount,
        type: "numeric",
      });

    return [
      renderButton({
        navigateTo: prev1,
        component: <icons.ArrowLeft className="btn-icon" />,
        disabled: prev1 === 0,
        title: localization.paginationPrev,
        icons,
      }),
      ...buttons.map((btn) =>
        renderButton({
          navigateTo: btn.navigateTo,
          component:
            btn.type === "ff-left" || btn.type === "ff-right" ? <icons.ThreeDots className="btn-icon" /> : undefined,
          type: btn.type,
          icons,
        })
      ),
      renderButton({
        navigateTo: next1,
        component: <icons.ArrowRight className="btn-icon" />,
        disabled: next1 > buttonCount,
        title: localization.paginationNext,
        icons,
      }),
    ];
  }
}
