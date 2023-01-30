import React, { useMemo } from "react";
import { useDataGridContext } from "../../../context/DataGridContext";
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
  const { dimensions } = useDataGridContext();

  const rowsToRender = useMemo(
    () => Math.floor((containerHeight > 0 ? containerHeight - 50 : 0) / dimensions.defaultDataRowHeight),
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
