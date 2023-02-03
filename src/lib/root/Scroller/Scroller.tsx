import React from "react";
import { useDataGridStaticContext } from "../../context/DataGridStaticContext";
import { ScrollerProps } from "../../types/Elements";
import { cs } from "../../utils/ConcatStyles";
import "./Scroller.css";

function Scroller(
  { minWidth, minHeight, emptySpacerVisible, verticalScrollbarWidth, className, ...props }: ScrollerProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const { virtualizationEnabled } = useDataGridStaticContext();

  return (
    <div className={cs("scroller", className)} ref={ref} {...props}>
      {emptySpacerVisible && (
        <div
          className="empty-spacer"
          style={{
            minWidth: minWidth + verticalScrollbarWidth,
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
          {virtualizationEnabled && (
            <div
              style={{
                minHeight: minHeight,
                minWidth: minWidth,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
export default React.forwardRef(Scroller);
