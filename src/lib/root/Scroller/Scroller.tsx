import React from "react";
import { ScrollerProps } from "../../types/Elements";
import { cs } from "../../utils/ConcatStyles";
import "./Scroller.css";

function Scroller(
  { minWidth, minHeight, emptySpacerVisible, className, ...props }: ScrollerProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <div className={cs("scroller", className)} ref={ref} {...props}>
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
          />
        </div>
      </div>
    </div>
  );
}
export default React.forwardRef(Scroller);
