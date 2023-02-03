import React from "react";
import { useDataGridStaticContext } from "../../../context/DataGridStaticContext";
import { OptionsMenuProps } from "../../../types/Utils";
import { cs } from "../../../utils/ConcatStyles";
import Fade from "../../animations/Fade/Fade";
import ButtonPrimary from "../Buttons/ButtonPrimary/ButtonPrimary";
import "./OptionsMenu.css";

export const OptionsMenu = React.forwardRef<HTMLDivElement, OptionsMenuProps<any>>(
  ({ handleColumnVisibility, visibleColumnKeys, className, toggleFullScreenMode, hideMenu, ...props }, ref) => {
    const { optionsMenuColumns, localization, icons } = useDataGridStaticContext();
    function handleToggleFullScreenMode() {
      toggleFullScreenMode?.();
      hideMenu();
    }
    return (
      <React.Fragment>
        <div className="options-menu-header">
          <h4 className="options-menu-title">{localization.settingsMenuTitle}</h4>
          {toggleFullScreenMode && (
            <ButtonPrimary title={localization.fullScreenToggle} className="fullscreen-toggle" onClick={handleToggleFullScreenMode}>
              <icons.FullScreen className="button-icon" />
            </ButtonPrimary>
          )}
        </div>
        <div className={cs("options-menu-body", className)} ref={ref} {...props}>
          <div className={"columns-list-wrapper"}>
            <ul>
              {optionsMenuColumns.map(({ key, title }) => {
                const isSelectionActive = visibleColumnKeys.has(key);
                return (
                  <li
                    className={cs("filter-element", isSelectionActive && "active")}
                    onClick={() => handleColumnVisibility(key)}
                    key={key as string}
                  >
                    <div className={cs("select-button", isSelectionActive && visibleColumnKeys.size === 1 && "disabled")} title={title}>
                      <span className="content">{title ?? `[${key as string}]`}</span>
                      <Fade duration={200} visible={isSelectionActive}>
                        <div className="check-button">
                          <icons.CheckMark className="check-icon" />
                        </div>
                      </Fade>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </React.Fragment>
    );
  }
);
