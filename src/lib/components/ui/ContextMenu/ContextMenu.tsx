import React from "react";
import Fade from "../../animations/Fade/Fade";
import type { ContextMenuProps } from "../../../types/Utils";
import "./ContextMenu.css";
import { cs } from "../../../utils/ConcatStyles";

export const ContextMenuOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & ContextMenuProps
>(({ elements, visible, onHide, className, ...props }, ref) => {
  return (
    <Fade onAnimationFinish={onHide} duration={200} visible={visible}>
      <div ref={ref} className={cs("context-menu-overlay", className)} {...props}>
        {elements
          .filter((x) => x !== undefined)
          .map((elem, i) => {
            if (Object.keys(elem!).length === 0) {
              return <div key={i + "_context_divider"} className="divider" />;
            }
            return (
              <div className="button-wrapper" key={elem?.key}>
                <button key={elem?.key} onClick={elem?.onClick}>
                  <span>{elem?.content}</span>
                </button>
              </div>
            );
          })}
      </div>
    </Fade>
  );
});
