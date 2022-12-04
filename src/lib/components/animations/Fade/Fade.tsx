/* eslint-disable react-hooks/exhaustive-deps */
import React, { HTMLAttributes, useEffect, useState } from "react";
import { concatStyles } from "../../../utils/ConcatStyles";
import "./Fade.css";
const Fade: React.FC<
  HTMLAttributes<HTMLDivElement> & {
    visible?: boolean;
    /**
     * Duration in milliseconds.
     */
    duration?: number;
    onAnimationFinish?: (visible: boolean) => void;
    // as?: keyof ReactHTML;
  }
> = ({ className, children, visible = true, onAnimationFinish, duration = 300, ...props }) => {
  const [callTimeout, setCallTimeout] = useState<NodeJS.Timeout>();
  const [shouldShow, setShouldShow] = useState<boolean>(visible);

  const handleAnimation = (visible: boolean) => {
    if (callTimeout !== undefined) {
      clearTimeout(callTimeout);
      setCallTimeout(undefined);
    }
    setCallTimeout(
      setTimeout(
        () => {
          setShouldShow(visible);
          onAnimationFinish?.(visible);
        },
        !visible ? duration - duration / 10 : 0
      )
    );
  };

  useEffect(() => {
    handleAnimation(visible);
  }, [visible]);

  const elementToDisplay = React.Children.map(children as any, (item) => {
    const newClassName = concatStyles(
      className,
      item.props.className,
      visible ? "fade-in" : "fade-out",
      !shouldShow && "disabled"
    );
    const props = {
      ...item.props,
      className: newClassName,
      style: { ...item.props.style, animationDuration: `${duration}ms` },
    };
    return React.cloneElement(item, props);
  });
  // const elementToDisplay = React.createElement(as, bodyProps, shouldShow && children);

  return shouldShow ? elementToDisplay : null;
};
export default Fade;
