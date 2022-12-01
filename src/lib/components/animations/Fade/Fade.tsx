/* eslint-disable react-hooks/exhaustive-deps */
import React, { HTMLAttributes, ReactHTML, useEffect, useState } from "react";
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
    as?: keyof ReactHTML;
  }
> = ({
  className,
  children,
  visible = true,
  onAnimationFinish,
  duration = 300,
  as = "div",
  ...props
}) => {
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

  const bodyProps = {
    className: concatStyles(
      className,
      visible ? "fade-in" : "fade-out",
      !shouldShow && "disabled"
    ),
    style: {
      animationDuration: `${duration}ms`,
    },
    ...props,
  };

  const elementToDisplay = React.createElement(
    as,
    bodyProps,
    shouldShow && children
  );

  return elementToDisplay;
};
export default Fade;
