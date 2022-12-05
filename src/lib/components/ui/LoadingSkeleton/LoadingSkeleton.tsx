import React from "react";
import { useTableContext } from "../../../context/TableContext";
import { TableRow } from "../../../index/TableConstructor/TableRow/TableRow";
import { concatStyles } from "../../../utils/ConcatStyles";
import Skeleton from "../Skeleton/Skeleton";
import "./LoadingSkeleton.css";

export default function LoadingTable({ className, style, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  const { tableHeight } = useTableContext();
  return (
    <div className={concatStyles("skeleton-table", className)} style={{ ...style, height: tableHeight }} {...props}>
      {[...Array(10)].map((_, i) => (
        <TableRow className="table-row-skeleton" key={i}>
          <Skeleton />
        </TableRow>
      ))}
    </div>
  );
}
