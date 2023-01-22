import React from "react";
import "./HeaderWrapperFill.css";

export default function HeaderWrapperFill(props: React.HtmlHTMLAttributes<HTMLDivElement>) {
  return (
    <div className="header-wrapper-fill" {...props}>
      <div className="header-wrapper-fill-filters"></div>
    </div>
  );
}
