import React from "react";
import "./List.scss";

export default function List(props: React.HtmlHTMLAttributes<HTMLDivElement>) {
  return <div className="list" {...props}></div>;
}
