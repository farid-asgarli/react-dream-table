import React from "react";
import Fade from "../../animations/Fade/Fade";
import type { ContextMenuProps } from "../../../types/Utils";
import styles from "./ContextMenu.module.css";
import { concatStyles } from "../../../utils/ConcatStyles";

export const ContextMenuOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & ContextMenuProps
>(({ elements, visible, onHide, className, ...props }, ref) => (
  <Fade
    onAnimationFinish={onHide}
    className={styles.ContextAnimator}
    visible={visible}
  >
    <div
      ref={ref}
      className={concatStyles(styles.ContextMenuOverlay, className)}
      {...props}
    >
      {elements
        .filter((x) => x !== undefined)
        .map((elem) => (
          <div key={elem?.key}>
            <button key={elem?.key} onClick={elem?.onClick}>
              <span>{elem?.content}</span>
            </button>
          </div>
        ))}
    </div>
  </Fade>
));
