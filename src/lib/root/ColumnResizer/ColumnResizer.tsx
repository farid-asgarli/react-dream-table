import React from "react";
import "./ColumnResizer.css";

export default function ColumnResizer(props: React.HtmlHTMLAttributes<HTMLDivElement>) {
  return (
    <div className="column-resizer">
      <div className="column-resize-handle" {...props}></div>
    </div>
  );
}
