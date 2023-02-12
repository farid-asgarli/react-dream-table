import React, { HTMLAttributes, useEffect, useRef, useState } from "react";
import { cs } from "../../../utils/ConcatStyles";
import "./Manual.scss";
function Manual({
  className,
  children,
  visible = true,
  onAnimationFinish,
  duration = 300,
  variant = "slide",
  type,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  visible?: boolean;
  /**
   * Duration in milliseconds.
   */
  duration?: number;
  onAnimationFinish?: (visible: boolean) => void;
  type?: "in" | "out";
  variant?: "slide" | "zoom";
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
      clearAnimationTimeout();
      callTimeout.current = setTimeout(
        () => {
          setShouldShow(visible);
          onAnimationFinish?.(visible);
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

  if (React.isValidElement(children) && shouldShow) {
    return React.Children.map(children, (item) => {
      const newClassName = cs(className, item.props.className, `${variant}-${type}`, !shouldShow && "disabled");
      const elemProps = {
        ...item.props,
        className: newClassName,
        style: { ...item.props.style, animationDuration: `${duration}ms` },
        ...props,
      };
      return React.cloneElement(item, elemProps);
    }) as unknown as JSX.Element;
  }

  return null;
}

export default Manual;
