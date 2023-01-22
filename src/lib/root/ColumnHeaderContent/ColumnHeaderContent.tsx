import React from "react";
import "./ColumnHeaderContent.css";

function ColumnHeaderContent(props: React.HtmlHTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) {
  return <div ref={ref} className="column-header-content" {...props}></div>;
}

export default React.forwardRef(ColumnHeaderContent);
