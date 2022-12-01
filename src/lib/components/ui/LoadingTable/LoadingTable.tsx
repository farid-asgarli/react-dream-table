import React from "react";
import { TableRow } from "../../../index/TableConstructor/TableRow/TableRow";
import { concatStyles } from "../../../utils/ConcatStyles";
import Skeleton from "../Skeleton/Skeleton";
import "./LoadingTable.css";

export default function LoadingTable(
  props: React.TableHTMLAttributes<HTMLTableElement>
) {
  return (
    <div className={concatStyles("skeleton-table")} {...props}>
      {[...Array(10)].map((_, i) => (
        <TableRow className="table-row-skeleton" key={i}>
          <Skeleton />
        </TableRow>
      ))}
    </div>
  );
}
