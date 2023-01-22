import React, { useMemo } from "react";
import { useTableContext } from "../../context/TableContext";
import { RowProps } from "../../types/Elements";
import { cs } from "../../utils/ConcatStyles";
import ExpandRowWrap from "../ExpandRowWrap/ExpandRowWrap";
import RowCellWrap from "../RowCellWrap/RowCellWrap";
import "./Row.css";

export default function Row({
  className,
  style,
  children,
  isSelected,
  expandRowProps,
  tabIndex,
  totalColumnsWidth,
  ...props
}: RowProps) {
  const { dimensions } = useTableContext();

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
      className={cs("row", isSelected && "selected", className)}
      style={{
        ...style,
        ...commonStyle,
      }}
      {...props}
    >
      <RowCellWrap style={commonStyle}>{children}</RowCellWrap>
      {expandRowProps?.children !== undefined && <ExpandRowWrap expandRowProps={expandRowProps} />}
    </div>
  );
}
