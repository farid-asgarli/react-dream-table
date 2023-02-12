import React, { HTMLAttributes, useEffect, useRef, useState } from "react";
import { cs } from "../../../utils/ConcatStyles";
import "./Auto.scss";

function Auto({
  className,
  children,
  visible = true,
  onAnimationFinish,
  duration = 200 /** ms */,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  visible?: boolean;
  duration?: number;
  onAnimationFinish?: (visible: boolean) => void;
}) {
  const callTimeout = useRef<NodeJS.Timeout | null>(null);
  const [shouldShow, setShouldShow] = useState<boolean>(visible);

  function clearAnimationTimeout() {
    if (callTimeout.current) {
      clearTimeout(callTimeout.current);
      callTimeout.current = null;
    }
  }

  useEffect(() => {
    const handleAnimation = (visible: boolean) => {
      if (visible) onAnimationFinish?.(visible);
      clearAnimationTimeout();
      callTimeout.current = setTimeout(
        () => {
          setShouldShow(visible);
          if (!visible) onAnimationFinish?.(visible);
        },
        !visible ? duration - duration / 10 : 0
      );
    };
    handleAnimation(visible);
    return () => {
      clearAnimationTimeout();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, visible]);

  function generateChildren(
    item: React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>,
    animType?: string
  ) {
    const newClassName = cs(className, item.props.className, animType, !shouldShow && "disabled");
    const elemProps = {
      ...item.props,
      className: newClassName,
      style: { ...item.props.style, animationDuration: `${duration}ms` },
      ...props,
    };
    return React.cloneElement(item, elemProps);
  }

  if (React.isValidElement(children)) {
    if (visible) return React.Children.map(children, (item) => generateChildren(item, "fade-in")) as unknown as JSX.Element;
    else if (!visible && shouldShow)
      return React.Children.map(children, (item) => generateChildren(item, "fade-out")) as unknown as JSX.Element;
    else return null;
  }

  return null;
}

export default Auto;
