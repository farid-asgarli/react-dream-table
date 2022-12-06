import React from "react";
import { useTableContext } from "../../../context/TableContext";
import CheckMark from "../../../icons/CheckMark";
import { SettingsMenuProps } from "../../../types/Utils";
import { concatStyles } from "../../../utils/ConcatStyles";
import Fade from "../../animations/Fade/Fade";
import "./SettingsMenu.css";

export const SettingsMenu = React.forwardRef<HTMLDivElement, SettingsMenuProps>(
  ({ handleHeaderVisibility, visibleColumnKeys, className, visible, ...props }, ref) => {
    const { settingsMenuColumns, localization } = useTableContext();
    return (
      <Fade visible={visible} duration={200}>
        <div className={concatStyles("settings-menu-body", className)} ref={ref} {...props}>
          <div className={"columns-list-wrapper"}>
            <ul>
              {settingsMenuColumns.map(({ key, title }) => {
                const isSelectionActive = visibleColumnKeys.has(key);
                return (
                  <li className={concatStyles("filter-element", isSelectionActive && "active")} onClick={() => handleHeaderVisibility(key)} key={key}>
                    <div className={concatStyles("select-button", isSelectionActive && visibleColumnKeys.size === 1 && "disabled")} title={title}>
                      <span className="content">{title ?? `[${key}]`}</span>
                      <Fade duration={200} visible={isSelectionActive}>
                        <div className="check-button">
                          <CheckMark className="check-icon" />
                        </div>
                      </Fade>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="settings-menu-header">
            <h4 className="settings-menu-title">{localization.columnVisibilityTitle}</h4>
          </div>
        </div>
      </Fade>
    );
  }
);
