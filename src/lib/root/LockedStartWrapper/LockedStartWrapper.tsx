import React from "react";
import { LockedWrapperProps } from "../../types/Elements";
import { cs } from "../../utils/ConcatStyles";
import "./LockedStartWrapper.scss";

function LockedStartWrapper({ type, ...props }: LockedWrapperProps, ref: React.ForwardedRef<HTMLDivElement>) {
  return <div ref={ref} className={cs("locked-start-wrapper", "locked", "type-" + type)} {...props}></div>;
}

export default React.forwardRef(LockedStartWrapper);
