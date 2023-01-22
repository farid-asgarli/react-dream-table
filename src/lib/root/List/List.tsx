import React from "react";
import "./List.css";

export default function List(props: React.HtmlHTMLAttributes<HTMLDivElement>) {
  return <div className="list" {...props}></div>;
}
