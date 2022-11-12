import React, { HTMLAttributes, useEffect, useState } from "react";
import { concatStyles } from "../../../utils/ConcatStyles";
import styles from "./Fade.module.css";
const Fade: React.FC<
  HTMLAttributes<HTMLDivElement> & {
    visible?: boolean;
    /**
     * Duration in milliseconds.
     */
    duration?: number;
    onAnimationFinish?: (visible: boolean) => void;
  }
> = ({
  className,
  children,
  visible = true,
  onAnimationFinish,
  duration = 300,
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

  return (
    <div
      className={concatStyles(
        styles.Body,
        className,
        visible ? styles.FadeIn : styles.FadeOut,
        !shouldShow && styles.Disable
      )}
      style={{
        animationDuration: `${duration}ms`,
      }}
      {...props}
    >
      {shouldShow && children}
    </div>
  );
};
export default Fade;
