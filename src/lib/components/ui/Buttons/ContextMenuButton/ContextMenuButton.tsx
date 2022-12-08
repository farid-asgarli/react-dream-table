import { ButtonHTMLAttributes } from "react";
import MultiDotIcon from "../../../../icons/MultiDot";
import { concatStyles } from "../../../../utils/ConcatStyles";

export default function ContextMenuButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" title="Menu" className={concatStyles("context-menu-button", className)} {...props}>
      <MultiDotIcon className={"context-menu-icon"} />
    </button>
  );
}
