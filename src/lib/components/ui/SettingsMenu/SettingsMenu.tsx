import React, { useEffect } from "react";
import CheckMark from "../../../icons/CheckMark";
import { SettingsMenuProps } from "../../../types/Utils";
import { concatStyles } from "../../../utils/ConcatStyles";
import Fade from "../../animations/Fade/Fade";
import styles from "./SettingsMenu.module.css";

export const SettingsMenu = React.forwardRef<HTMLDivElement, SettingsMenuProps>(
  ({ columns, handleHeaderVisibility, visibleColumnKeys, ...props }, ref) => {
    useEffect(() => {
      console.log("rendered settingsMenu");
    }, []);

    return (
      <div className={styles.Body} ref={ref}>
        <div className={styles.HeadersListWrapper}>
          <ul>
            {columns.map(({ key, title }) => {
              const isSelectionActive = visibleColumnKeys.has(key);
              return (
                <li
                  className={concatStyles(
                    styles.FilterElement,
                    isSelectionActive && styles.Active
                  )}
                  onClick={() => handleHeaderVisibility(key)}
                  key={key}
                >
                  <button
                    disabled={isSelectionActive && visibleColumnKeys.size === 1}
                    type="button"
                    title={title}
                  >
                    <span>{title ?? `[${key}]`}</span>
                    <Fade
                      visible={isSelectionActive}
                      className={styles.CloseIconWrapper}
                    >
                      <CheckMark className={styles.CloseIcon} />
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
