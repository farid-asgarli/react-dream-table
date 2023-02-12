import React from "react";
import "./RowContainer.scss";

export default function RowContainer(props: React.HtmlHTMLAttributes<HTMLDivElement>) {
  return <div className="row-container" {...props}></div>;
}
