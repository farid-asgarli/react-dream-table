import { HTMLAttributes } from "react";
import "./Manual.scss";
declare function Manual({ className, children, visible, onAnimationFinish, duration, variant, type, ...props }: HTMLAttributes<HTMLDivElement> & {
    visible?: boolean;
    /**
     * Duration in milliseconds.
     */
    duration?: number;
    onAnimationFinish?: (visible: boolean) => void;
    type?: "in" | "out";
    variant?: "slide" | "zoom";
}): JSX.Element | null;
export default Manual;
