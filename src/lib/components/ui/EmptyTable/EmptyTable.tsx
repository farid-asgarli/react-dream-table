import React from "react";
import { useTableContext } from "../../../context/TableContext";
import Empty from "../../../icons/Empty";
import { concatStyles } from "../../../utils/ConcatStyles";
import "./EmptyTable.css";

export default function EmptyTable({ style, className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  const { localization, tableHeight } = useTableContext();

  return (
    <div className={concatStyles("empty-table", className)} style={{ ...style, height: tableHeight }} {...props}>
      <div className={"empty-table-wrapper"}>
        <Empty className={"empty-icon"} />
        <span className={"empty-text"}>{localization.filterEmpty}</span>
      </div>
    </div>
  );
}
