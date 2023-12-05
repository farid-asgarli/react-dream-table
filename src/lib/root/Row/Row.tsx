import React, { useMemo } from 'react';
import { useDataGridStaticContext } from '../../context/DataGridStaticContext';
import { RowProps } from '../../types/Elements';
import { cs } from '../../utils/ConcatStyles';
import ExpandRowWrap from '../ExpandRowWrap/ExpandRowWrap';
import RowCellWrap from '../RowCellWrap/RowCellWrap';
import './Row.scss';

export default function Row({
  className,
  style,
  children,
  isRowSelected,
  isRowActive,
  expandRowProps,
  tabIndex,
  totalColumnsWidth,
  onContextMenu,
  ...props
}: RowProps) {
  const { dimensions, animationProps, isRowClickable } = useDataGridStaticContext();

  const commonStyle: React.CSSProperties = useMemo(
    () => ({
      minWidth: totalColumnsWidth,
      width: totalColumnsWidth,
    }),
    [totalColumnsWidth]
  );

  const rowCellWrapStyle: React.CSSProperties = useMemo(
    () => ({
      ...commonStyle,
      height: dimensions.defaultDataRowHeight,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dimensions.defaultDataRowHeight]
  );

  return (
    <div
      className={cs('row', isRowSelected && 'selected', isRowActive && 'active', isRowClickable && 'clickable', className)}
      style={{
        ...style,
        transitionDuration: `${animationProps.duration}ms`,
        ...commonStyle,
      }}
      role="row"
      data-clickable={isRowClickable}
      data-active={isRowActive}
      data-selected={isRowSelected}
      {...props}
    >
      <RowCellWrap style={rowCellWrapStyle} onContextMenu={onContextMenu}>
        {children}
      </RowCellWrap>
      {expandRowProps?.children !== undefined && <ExpandRowWrap expandRowProps={expandRowProps} />}
    </div>
  );
}
