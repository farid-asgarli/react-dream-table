import { HTMLAttributes } from "react";
import "./Auto.scss";
declare function Auto({ className, children, visible, onAnimationFinish, duration /** ms */, ...props }: HTMLAttributes<HTMLDivElement> & {
    visible?: boolean;
    duration?: number;
    onAnimationFinish?: (visible: boolean) => void;
}): JSX.Element | null;
export default Auto;
