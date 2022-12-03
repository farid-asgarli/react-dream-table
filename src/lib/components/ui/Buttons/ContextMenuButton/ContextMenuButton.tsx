import { ButtonHTMLAttributes } from "react";
import MultiDotIcon from "../../../../icons/MultiDot";

export default function ContextMenuButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" title="Menu" className={"context-menu-button"} {...props}>
      <MultiDotIcon className={"context-menu-icon"} />
    </button>
  );
}
