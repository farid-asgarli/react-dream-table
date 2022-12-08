import React from "react";
import { useTableContext } from "../../../context/TableContext";
import { TableRow } from "../../../index/TableConstructor/TableRow/TableRow";
import { concatStyles } from "../../../utils/ConcatStyles";
import Skeleton from "../Skeleton/Skeleton";
import "./LoadingSkeleton.css";

export default function LoadingSkeleton({
  className,
  style,
  rowCount = 10,
  overrideTotalHeight,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement> & { rowCount?: number; overrideTotalHeight?: boolean | undefined }) {
  const { tableHeight } = useTableContext();
  return (
    <div
      className={concatStyles("skeleton-table", className)}
      style={{ ...style, height: overrideTotalHeight ? tableHeight : undefined }}
      {...props}
    >
      {[...Array(rowCount)].map((_, i) => (
        <TableRow className="table-row-skeleton" key={i}>
          <Skeleton />
        </TableRow>
      ))}
    </div>
  );
}
