import React from "react";
import Fade from "../../animations/Fade/Fade";
import type { ContextMenuProps } from "../../../types/Utils";
import "./ContextMenu.css";
import { concatStyles } from "../../../utils/ConcatStyles";
import { useTableContext } from "../../../context/TableContext";

export const ContextMenuOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & ContextMenuProps>(
  ({ elements, visible, onHide, className, style, ...props }, ref) => {
    const { elementStylings } = useTableContext();
    return (
      <Fade onAnimationFinish={onHide} className={"context-animator"} visible={visible}>
        <div
          ref={ref}
          style={{ ...style, ...elementStylings?.contextMenu?.style }}
          className={concatStyles("context-menu-overlay", className, elementStylings?.contextMenu?.className)}
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
    );
  }
);
