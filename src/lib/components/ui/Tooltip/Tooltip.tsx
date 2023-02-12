/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef, useState } from "react";
import { Animations } from "../../animations/Animations";
import "./Tooltip.scss";

export default function Tooltip({ children, enabled }: { children: JSX.Element; enabled: boolean }) {
  if (!enabled) return children;

  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
  const inputUpdateTimeout = useRef<NodeJS.Timeout | null>(null);

  function handleDisplayTooltip(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!(e.currentTarget.scrollWidth > e.currentTarget.clientWidth)) return;
    clearUpdateTimeout();
    inputUpdateTimeout.current = setTimeout(async () => {
      setTooltipVisible(true);
    }, 600);
  }

  function handleHideTooltip(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    clearUpdateTimeout();
    if (tooltipVisible) setTooltipVisible(false);
  }

  useEffect(() => {
    return () => clearUpdateTimeout();
  }, []);

  function clearUpdateTimeout() {
    if (inputUpdateTimeout.current) clearTimeout(inputUpdateTimeout.current);
    inputUpdateTimeout.current = null;
  }

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        onMouseOver: handleDisplayTooltip,
        onMouseLeave: handleHideTooltip,
      } as React.HTMLAttributes<HTMLDivElement>);
    }
    return child;
  });
  return (
    <>
      <Animations.Auto visible={tooltipVisible}>
        <div className="data-grid-tooltip">{children}</div>
      </Animations.Auto>
      {childrenWithProps}
    </>
  );
}
