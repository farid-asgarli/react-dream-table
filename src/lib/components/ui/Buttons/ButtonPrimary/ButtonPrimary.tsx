import React from "react";
import { cs } from "../../../../utils/ConcatStyles";
import "./ButtonPrimary.scss";
export default function ButtonPrimary({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={cs(className, "button-primary")} {...props} />;
}
