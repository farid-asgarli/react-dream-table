import React, { useState } from "react";
import { useDataGridStaticContext } from "../../../context/DataGridStaticContext";
import { GridDataType, OptionsMenuProps } from "../../../types/Utils";
import { cs } from "../../../utils/ConcatStyles";
import { Animations } from "../../animations/Animations";
import { Portal } from "../Portal/Portal";
import ButtonPrimary from "../Buttons/ButtonPrimary/ButtonPrimary";
import Toggle from "../Toggle/Toggle";
import "./SettingsMenu.scss";

export function OptionsMenu<DataType extends GridDataType>({
  visibleColumnKeys,
  className,
  optionsMenuProps,
  isDarkModeEnabled,
  isFullScreenModeEnabled,
  isFilterMenuVisible,
  isColumnGroupingEnabled,
  isColumnVisibilityEnabled,
  isColumnFilteringEnabled,
  updateDarkMode,
  updateActiveHeader,
  updateFullScreenMode,
  updateColumnVisibility,
  updateFilterMenuVisibility,
  updateColumnGrouping,
  updatePosition,
  ...props
}: OptionsMenuProps<DataType>) {
  const { columnVisibilityProps, localization, icons } = useDataGridStaticContext();

  const [activeWindowIndex, setActiveWindowIndex] = useState("0");

  function updateActiveWindow(index: string) {
    setActiveWindowIndex(index);
  }

  return (
    <React.Fragment>
      <div className={cs("data-grid-options-menu-body", className)} {...props}>
        <Portal.Container indexOrder={["0", "1"]} activeWindowIndex={activeWindowIndex}>
          <Portal.Window index="0" onAnimationFinish={(val) => val && updatePosition()}>
            <div className="data-grid-options-menu-header">
              <h4 className="data-grid-options-menu-title">{localization.settingsMenuTitle}</h4>
            </div>
            <div className="data-grid-options-menu-toggles">
              {optionsMenuProps?.fullScreenToggle?.enabled !== false && (
                <div className="menu-toggle">
                  <label htmlFor="full-screen-toggle" className="menu-toggle-title">
                    <icons.FullScreen className="menu-toggle-icon" /> <span>{localization.fullScreenToggle}</span>
                  </label>
                  <Toggle onChange={updateFullScreenMode} name="full-screen-toggle" checked={isFullScreenModeEnabled} size={40} />
                </div>
              )}
              {optionsMenuProps?.filterMenuToggle?.enabled !== false && isColumnFilteringEnabled && (
                <div className="menu-toggle">
                  <label htmlFor="filter-menu-toggle" className="menu-toggle-title">
                    <icons.FilterVisibility className="menu-toggle-icon" /> <span>{localization.filterMenuVisibilityToggle}</span>
                  </label>
                  <Toggle onChange={updateFilterMenuVisibility} name="filter-menu-toggle" checked={isFilterMenuVisible} size={40} />
                </div>
              )}
              {optionsMenuProps?.groupedColumnToggle?.enabled !== false && (
                <div className="menu-toggle">
                  <label htmlFor="group-menu-toggle" className="menu-toggle-title">
                    <icons.ColumnGroup className="menu-toggle-icon" /> <span>{localization.groupedColumnToggle}</span>
                  </label>
                  <Toggle onChange={updateColumnGrouping} name="group-menu-toggle" checked={isColumnGroupingEnabled} size={40} />
                </div>
              )}
              {optionsMenuProps?.darkModeToggle?.enabled !== false && (
                <div className="menu-toggle">
                  <label htmlFor="dark-mode-toggle" className="menu-toggle-title">
                    <icons.DarkMode className="menu-toggle-icon" /> <span> {localization.darkModeToggle}</span>
                  </label>
                  <Toggle onChange={updateDarkMode} name="dark-mode-toggle" checked={isDarkModeEnabled} size={40} />
                </div>
              )}
              <div className="menu-divider" />
              {isColumnVisibilityEnabled && (
                <div onClick={() => updateActiveWindow("1")} className="menu-toggle">
                  <label className="menu-toggle-title">
                    <icons.Columns className="menu-toggle-icon" /> <span>{localization.columnVisibilityOptions}</span>
                  </label>
                  <icons.ArrowRight className="menu-toggle-icon" />
                </div>
              )}
              {/* <div className="menu-toggle">
                <label className="menu-toggle-title">
                  <icons.Info className="menu-toggle-icon" /> <span>{localization.aboutTitle}</span>
                </label>
              </div> */}
            </div>
          </Portal.Window>
          <Portal.Window index="1" onAnimationFinish={(val) => val && updatePosition()}>
            <div className="columns-list-wrapper">
              <div className="data-grid-options-menu-header">
                <h4 className="data-grid-options-menu-title">{localization.columnVisibilityOptions}</h4>
              </div>
              <ul>
                {columnVisibilityProps.map(({ key, title }) => {
                  const isSelectionActive = visibleColumnKeys.has(key as string);
                  return (
                    <li
                      className={cs("filter-element", isSelectionActive && "active")}
                      onClick={() => updateColumnVisibility(key as string)}
                      key={key as string}
                      onMouseEnter={() => updateActiveHeader(key as string)}
                      onMouseLeave={() => updateActiveHeader(undefined)}
                    >
                      <div className={cs("select-button", isSelectionActive && visibleColumnKeys.size === 1 && "disabled")} title={title}>
                        <span className="content">{title ?? `[${key as string}]`}</span>
                        <Animations.Auto duration={200} visible={isSelectionActive}>
                          <div className="check-button">
                            <icons.CheckMark className="check-icon" />
                          </div>
                        </Animations.Auto>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="bottom-utility">
              <ButtonPrimary className="back-button" onClick={() => updateActiveWindow("0")}>
                <icons.ArrowLeft className="button-icon" />
                <span>{localization.goBackTitle}</span>
              </ButtonPrimary>
            </div>
          </Portal.Window>
        </Portal.Container>
      </div>
    </React.Fragment>
  );
}
