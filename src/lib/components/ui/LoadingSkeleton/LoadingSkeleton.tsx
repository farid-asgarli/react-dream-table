import React, { useMemo } from "react";
import { useDataGridStaticContext } from "../../../context/DataGridStaticContext";
import Row from "../../../root/Row/Row";
import { cs } from "../../../utils/ConcatStyles";
import Fade from "../../animations/Fade/Fade";
import Skeleton from "../Skeleton/Skeleton";
// import VirtualDataGridRow from "../../../DataGrid/DataGridRow/VirtualDataGridRow";
// import Skeleton from "../Skeleton/Skeleton";
import "./LoadingSkeleton.css";

export default function LoadingSkeleton({
  className,
  style,
  containerHeight,
  ...props
}: React.HtmlHTMLAttributes<HTMLDivElement> & { containerHeight: number }) {
  const { dimensions } = useDataGridStaticContext();

  const rowsToRender = useMemo(
    () => Math.floor((containerHeight > 0 ? containerHeight - 50 : 0) / dimensions.defaultDataRowHeight),
    [containerHeight, dimensions.defaultDataRowHeight]
  );

  return (
    <Fade>
      <div
        className={cs("skeleton-data-grid", className)}
        style={{
          ...style,
        }}
        {...props}
      >
        {[...Array(rowsToRender)].map((_, i) => (
          <Row
            style={{
              height: dimensions.defaultDataRowHeight,
            }}
            totalColumnsWidth="100%"
            className="row-skeleton"
            key={i}
          >
            <Skeleton />
          </Row>
        ))}
      </div>
    </Fade>
  );
}
