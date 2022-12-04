import React from "react";
import CheckMark from "../../../icons/CheckMark";
import { SettingsMenuProps } from "../../../types/Utils";
import { concatStyles } from "../../../utils/ConcatStyles";
import Fade from "../../animations/Fade/Fade";
import "./SettingsMenu.css";

export const SettingsMenu = React.forwardRef<HTMLDivElement, SettingsMenuProps>(
  ({ columns, handleHeaderVisibility, visibleColumnKeys, className, ...props }, ref) => {
    return (
      <div className={concatStyles("settings-menu-body", className)} ref={ref} {...props}>
        <div className={"columns-list-wrapper"}>
          <ul>
            {columns.map(({ key, title }) => {
              const isSelectionActive = visibleColumnKeys.has(key);
              return (
                <li
                  className={concatStyles("filter-element", isSelectionActive && "active")}
                  onClick={() => handleHeaderVisibility(key)}
                  key={key}
                >
                  <button disabled={isSelectionActive && visibleColumnKeys.size === 1} type="button" title={title}>
                    <span>{title ?? `[${key}]`}</span>
                    <Fade visible={isSelectionActive} className={"close-icon-wrapper"}>
                      <CheckMark className={"close-icon"} />
                    </Fade>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
);
