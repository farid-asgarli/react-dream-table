import React, { HTMLAttributes } from "react";
declare const Fade: React.FC<HTMLAttributes<HTMLDivElement> & {
    visible?: boolean;
    /**
     * Duration in milliseconds.
     */
    duration?: number;
    onAnimationFinish?: (visible: boolean) => void;
}>;
export default Fade;
