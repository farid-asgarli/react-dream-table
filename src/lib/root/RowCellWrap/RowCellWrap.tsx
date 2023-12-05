import React from 'react';
import './RowCellWrap.scss';

export default function RowCellWrap(props: React.HtmlHTMLAttributes<HTMLDivElement>) {
  return <div role="rowgroup" className="row-cell-wrap" {...props}></div>;
}
