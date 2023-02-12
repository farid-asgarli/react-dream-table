import React from "react";
import "./ColumnHeaderContent.scss";

function ColumnHeaderContent(props: React.HtmlHTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) {
  return (
    <div ref={ref} title={typeof props.children === "string" ? props.children : undefined} className="column-header-content" {...props} />
  );
}

export default React.forwardRef(ColumnHeaderContent);
