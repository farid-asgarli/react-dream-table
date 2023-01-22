import React from "react";
import { cs } from "../../utils/ConcatStyles";
import "./Cell.css";

export default function Cell({ className, ...props }: React.HtmlHTMLAttributes<HTMLDivElement>) {
  return <div className={cs("cell", className)} {...props}></div>;
}
