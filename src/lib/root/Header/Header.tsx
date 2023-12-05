import React from 'react';
import './Header.scss';

function Header(props: React.HtmlHTMLAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) {
  return <div role="columnheader" className="header" {...props} ref={ref}></div>;
}

export default React.forwardRef(Header);
