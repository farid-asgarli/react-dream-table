import React from "react";
import "./Header.css";

function Header(props: React.HtmlHTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) {
  return <div className="header" {...props} ref={ref}></div>;
}

export default React.forwardRef(Header);
