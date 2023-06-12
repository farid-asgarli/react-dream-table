import React, { useMemo } from "react";
import { Animations } from "../../components/animations/Animations";
import ButtonPrimary from "../../components/ui/Buttons/ButtonPrimary/ButtonPrimary";
import { Select } from "../../components/ui/Select/Select";
import Skeleton from "../../components/ui/Skeleton/Skeleton";
import { useDataGridStaticContext } from "../../context/DataGridStaticContext";
import { DataGridIconsDefinition, DataGridLocalizationDefinition } from "../../types/DataGrid";
import type { FooterProps } from "../../types/Utils";
import { cs } from "../../utils/ConcatStyles";
import "./Footer.scss";

interface RenderPaginationButtonProps {
  navigateTo: number;
  component?: React.ReactNode;
  disabled?: boolean;
  title?: string;
  type?: "numeric" | "ff-left" | "ff-right";
  icons: DataGridIconsDefinition;
}

export default function Footer({
  paginationProps,
  className,
  optionsMenu,
  progressReporters,
  selectedRows,
  loading,
  style,
  ...props
}: FooterProps & React.HTMLAttributes<HTMLDivElement>) {
  const { localization, dimensions, icons } = useDataGridStaticContext();

  const { gridPaginationProps, updateCurrentPagination, paginationDefaults } = paginationProps;
  const DEFAULT_PAGE_SIZES = paginationDefaults?.pageSizes ?? [5, 10, 20, 50, 100];

  const renderPaginationNumbers = useMemo(
    () =>
      renderPaginationButtons({
        paginationProps,
        localization,
        icons,
      }),

    [icons, localization, paginationProps]
  );

  const renderDataCount = useMemo(
    () =>
      selectedRows.size > 0 ? (
        <div className="selected-data-count">
          <Animations.Auto key={selectedRows.size}>
            <span className="data-count">{selectedRows.size}&nbsp;</span>
          </Animations.Auto>
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
              <Animations.Auto key={gridPaginationProps.dataCount}>
                <span className="data-count">{gridPaginationProps.dataCount ?? 0}&nbsp;</span>
              </Animations.Auto>
              <span className="title">{localization.paginationTotalCount}</span>
            </>
          )}
        </div>
      ),
    [selectedRows.size, localization.rowsSelectedTitle, localization.paginationTotalCount, loading, gridPaginationProps.dataCount]
  );

  return (
    <div
      className={cs("footer", className)}
      style={{ ...style, minHeight: dimensions.defaultFooterHeight, maxHeight: dimensions.defaultFooterHeight }}
      {...props}
    >
      <Animations.Auto>
        <div className={"bottom"}>
          <div className={"pagination-data-count"}>
            {optionsMenu.enabled && (
              <div className={"settings"}>
                <ButtonPrimary
                  title={localization.settingsMenuTitle}
                  onClick={(e) =>
                    optionsMenu.displayOptionsMenu({
                      data: {},
                      identifier: "settings",
                      position: {
                        xAxis: e.clientX,
                        yAxis: e.clientY,
                      },
                    })
                  }
                  className={cs("settings-button", optionsMenu.isMenuVisible && "active")}
                >
                  <icons.Settings className="button-icon" />
                </ButtonPrimary>
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
              <Select
                onChange={(e) => updateCurrentPagination({ currentPage: 1, pageSize: e })}
                options={DEFAULT_PAGE_SIZES.map((op: number) => ({
                  children: op,
                  value: op,
                }))}
                value={gridPaginationProps.pageSize}
              />
            )}
          </div>
        </div>
      </Animations.Auto>
    </div>
  );
}

function renderPaginationButtons({
  paginationProps: { gridPaginationProps, updateCurrentPagination },
  localization,
  icons,
}: {
  paginationProps: FooterProps["paginationProps"];
  localization: DataGridLocalizationDefinition;
  icons: DataGridIconsDefinition;
}) {
  function updateCurrentPage(navigateTo: number) {
    if (gridPaginationProps.dataCount && gridPaginationProps.pageSize) {
      const buttonCount = Math.ceil(gridPaginationProps.dataCount / gridPaginationProps.pageSize);
      if (navigateTo <= buttonCount && navigateTo >= 1)
        updateCurrentPagination({
          currentPage: navigateTo,
        });
    }
  }

  function renderButton({ navigateTo, component, disabled, title, type, icons }: RenderPaginationButtonProps) {
    const isActive = gridPaginationProps.currentPage === navigateTo;

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

  if (gridPaginationProps.pageSize && gridPaginationProps.dataCount) {
    const buttons: {
      type: "numeric" | "ff-left" | "ff-right";
      navigateTo: number;
    }[] = [];

    const buttonCount = Math.ceil(gridPaginationProps.dataCount / gridPaginationProps.pageSize);
    if (gridPaginationProps.currentPage! > buttonCount) updateCurrentPage(buttonCount);

    const initialPageNumber = 1;
    const threeDotsDistance = 3;
    const threeDotsNavigationStep = 5;

    const prev1 = gridPaginationProps.currentPage! - 1;

    const next1 = gridPaginationProps.currentPage! + 1;

    buttons.push({
      navigateTo: initialPageNumber,
      type: "numeric",
    });

    if (gridPaginationProps.currentPage! - threeDotsDistance >= 1)
      buttons.push({
        navigateTo: prev1 - (threeDotsNavigationStep - 1),
        type: "ff-left",
      });

    if (prev1 !== initialPageNumber && prev1 > 0)
      buttons.push({
        navigateTo: prev1,
        type: "numeric",
      });

    if (gridPaginationProps.currentPage !== buttonCount && gridPaginationProps.currentPage !== initialPageNumber)
      buttons.push({
        navigateTo: gridPaginationProps.currentPage!,
        type: "numeric",
      });

    if (buttonCount > next1)
      buttons.push({
        navigateTo: next1,
        type: "numeric",
      });

    if (gridPaginationProps.currentPage! + threeDotsDistance <= buttonCount)
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
          component: btn.type === "ff-left" || btn.type === "ff-right" ? <icons.ThreeDots className="btn-icon" /> : undefined,
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
