import React from "react";
import Empty from "../../../icons/Empty";
import { ContextLocalization } from "../../../types/Table";
import { concatStyles } from "../../../utils/ConcatStyles";
import "./EmptyTable.css";

export default function EmptyTable({
  localization,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement> & {
  localization: ContextLocalization;
}) {
  return (
    <div className={concatStyles("empty-table")} {...props}>
      <div className={"empty-table-wrapper"}>
        <Empty className={"empty-icon"} />
        <span className={"empty-text"}>{localization.filterEmpty}</span>
      </div>
    </div>
  );
}
