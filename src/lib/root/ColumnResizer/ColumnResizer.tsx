import React from "react";
import { cs } from "../../utils/ConcatStyles";
import "./ColumnResizer.css";

function ColumnResizer(
  { className, ...props }: React.HtmlHTMLAttributes<HTMLDivElement>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <div className={cs("column-resizer", className)} ref={ref}>
      <div className="column-resize-handle" {...props}></div>
    </div>
  );
}
export default React.forwardRef(ColumnResizer);
