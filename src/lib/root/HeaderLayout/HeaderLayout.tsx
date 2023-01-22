import React from "react";
import "./HeaderLayout.css";

function HeaderLayout(props: React.HtmlHTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) {
  return <div className="header-layout" {...props} ref={ref}></div>;
}

export default React.forwardRef(HeaderLayout);
