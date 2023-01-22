import React, { useMemo } from "react";
import { useTableContext } from "../../../context/TableContext";
import Row from "../../../root/Row/Row";
import { cs } from "../../../utils/ConcatStyles";
import Skeleton from "../Skeleton/Skeleton";
// import VirtualTableRow from "../../../Table/TableRow/VirtualTableRow";
// import Skeleton from "../Skeleton/Skeleton";
import "./LoadingSkeleton.css";

export default function LoadingSkeleton({
  className,
  style,
  containerHeight,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement> & { containerHeight: number }) {
  const { dimensions } = useTableContext();

  const rowsToRender = useMemo(
    () => Math.floor(containerHeight / dimensions.defaultDataRowHeight),
    [containerHeight, dimensions.defaultDataRowHeight]
  );

  return (
    <div
      className={cs("skeleton-table", className)}
      style={{
        ...style,
      }}
      {...props}
    >
      {[...Array(rowsToRender)].map((_, i) => (
        <Row totalColumnsWidth="100%" className="row-skeleton" key={i}>
          <Skeleton />
        </Row>
      ))}
    </div>
  );
}
