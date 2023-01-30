import React, { useMemo } from "react";
import { useDataGridContext } from "../../context/DataGridContext";
import { RowProps } from "../../types/Elements";
import { cs } from "../../utils/ConcatStyles";
import ExpandRowWrap from "../ExpandRowWrap/ExpandRowWrap";
import RowCellWrap from "../RowCellWrap/RowCellWrap";
import "./Row.css";

export default function Row({
  className,
  style,
  children,
  isRowSelected,
  isRowActive,
  expandRowProps,
  tabIndex,
  totalColumnsWidth,
  ...props
}: RowProps) {
  const { dimensions, animationProps } = useDataGridContext();

  const commonStyle: React.CSSProperties = useMemo(
    () => ({
      minWidth: totalColumnsWidth,
      maxWidth: totalColumnsWidth,
      minHeight: dimensions.defaultDataRowHeight,
      maxHeight: dimensions.defaultDataRowHeight,
    }),
    [dimensions.defaultDataRowHeight, totalColumnsWidth]
  );

  return (
    <div
      className={cs("row", isRowSelected && "selected", isRowActive && "active", className)}
      style={{
        ...style,
        transitionDuration: `${animationProps.duration}ms`,
        ...commonStyle,
      }}
      {...props}
    >
      <RowCellWrap style={commonStyle}>{children}</RowCellWrap>
      {expandRowProps?.children !== undefined && <ExpandRowWrap expandRowProps={expandRowProps} />}
    </div>
  );
}
