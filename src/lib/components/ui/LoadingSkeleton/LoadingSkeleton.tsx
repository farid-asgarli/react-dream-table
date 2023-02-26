import React, { useMemo } from "react";
import { useDataGridStaticContext } from "../../../context/DataGridStaticContext";
import Row from "../../../root/Row/Row";
import { cs } from "../../../utils/ConcatStyles";
import { Animations } from "../../animations/Animations";
import Skeleton from "../Skeleton/Skeleton";
import "./LoadingSkeleton.scss";

export default function LoadingSkeleton({
  className,
  style,
  containerHeight,
  visible,
  ...props
}: React.HtmlHTMLAttributes<HTMLDivElement> & { containerHeight: number; visible: boolean }) {
  const { dimensions } = useDataGridStaticContext();

  const rowsToRender = useMemo(
    () => Math.floor((containerHeight > 0 ? containerHeight - 50 : 0) / dimensions.defaultDataRowHeight),
    [containerHeight, dimensions.defaultDataRowHeight]
  );

  return (
    <Animations.Auto visible={visible}>
      <div
        className={cs("skeleton-data-grid", className)}
        style={{
          ...style,
        }}
        {...props}
      >
        {rowsToRender &&
          rowsToRender > 0 &&
          [...Array(rowsToRender)].map((_, i) => (
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
    </Animations.Auto>
  );
}
