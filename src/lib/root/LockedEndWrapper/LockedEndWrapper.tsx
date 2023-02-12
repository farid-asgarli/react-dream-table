import React from "react";
import { LockedWrapperProps } from "../../types/Elements";
import { cs } from "../../utils/ConcatStyles";
import "./LockedEndWrapper.scss";

function LockedEndWrapper({ type, ...props }: LockedWrapperProps, ref: React.ForwardedRef<HTMLDivElement>) {
  return <div ref={ref} className={cs("locked-end-wrapper", "locked", "type-" + type)} {...props}></div>;
}

export default React.forwardRef(LockedEndWrapper);
