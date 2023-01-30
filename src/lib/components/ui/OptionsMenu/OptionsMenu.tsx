import React from "react";
import { useDataGridContext } from "../../../context/DataGridContext";
import { OptionsMenuProps } from "../../../types/Utils";
import { cs } from "../../../utils/ConcatStyles";
import Fade from "../../animations/Fade/Fade";
import "./OptionsMenu.css";

export const OptionsMenu = React.forwardRef<HTMLDivElement, OptionsMenuProps<any>>(
  ({ handleColumnVisibility, visibleColumnKeys, className, ...props }, ref) => {
    const { optionsMenuColumns, localization, icons } = useDataGridContext();
    return (
      <React.Fragment>
        <div className="options-menu-header">
          <h4 className="options-menu-title">{localization.columnVisibilityTitle}</h4>
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
        </div>
      </React.Fragment>
    );
  }
);
