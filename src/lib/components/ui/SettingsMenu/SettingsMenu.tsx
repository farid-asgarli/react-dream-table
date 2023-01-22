import React from "react";
import { useTableContext } from "../../../context/TableContext";
import { SettingsMenuProps } from "../../../types/Utils";
import { cs } from "../../../utils/ConcatStyles";
import Fade from "../../animations/Fade/Fade";
import "./SettingsMenu.css";

export const SettingsMenu = React.forwardRef<HTMLDivElement, SettingsMenuProps<any>>(
  ({ handleColumnVisibility, visibleColumnKeys, className, visible, ...props }, ref) => {
    const { settingsMenuColumns, localization, icons } = useTableContext();
    return (
      <Fade visible={visible} duration={200}>
        <div className={cs("settings-menu-body", className)} ref={ref} {...props}>
          <div className={"columns-list-wrapper"}>
            <ul>
              {settingsMenuColumns.map(({ key, title }) => {
                const isSelectionActive = visibleColumnKeys.has(key);
                return (
                  <li
                    className={cs("filter-element", isSelectionActive && "active")}
                    onClick={() => handleColumnVisibility(key)}
                    key={key as string}
                  >
                    <div
                      className={cs("select-button", isSelectionActive && visibleColumnKeys.size === 1 && "disabled")}
                      title={title}
                    >
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
          <div className="settings-menu-header">
            <h4 className="settings-menu-title">{localization.columnVisibilityTitle}</h4>
          </div>
        </div>
      </Fade>
    );
  }
);
