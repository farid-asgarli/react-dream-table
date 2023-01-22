import React from "react";
import { ScrollerProps } from "../../types/Elements";
import "./Scroller.css";

function Scroller(
  { minWidth, minHeight, emptySpacerVisible, ...props }: ScrollerProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <div className="scroller" ref={ref} {...props}>
      {emptySpacerVisible && (
        <div
          className="empty-spacer"
          style={{
            minWidth: minWidth,
          }}
        />
      )}
      <div className="sticky-scroller">
        <div
          style={{
            position: "absolute",
            minWidth: "100%",
            direction: "ltr",
          }}
        >
          {props.children}
          <div
            style={{
              minHeight: minHeight,
              minWidth: minWidth,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
export default React.forwardRef(Scroller);
