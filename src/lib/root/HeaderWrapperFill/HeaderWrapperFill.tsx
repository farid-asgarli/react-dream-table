import React from "react";
import "./HeaderWrapperFill.scss";

export default function HeaderWrapperFill(props: React.HtmlHTMLAttributes<HTMLDivElement>) {
  return (
    <div className="header-wrapper-fill" {...props}>
      <div className="header-wrapper-fill-filters"></div>
    </div>
  );
}
