import { ButtonHTMLAttributes } from "react";
import { useTableContext } from "../../../../context/TableContext";
import { cs } from "../../../../utils/ConcatStyles";
import "./ContextMenuButton.css";

export default function ContextMenuButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { icons, localization } = useTableContext();
  return (
    <button type="button" title={localization.menuTitle} className={cs("context-menu-button", className)} {...props}>
      <icons.MultiDot className={"context-menu-icon"} />
    </button>
  );
}
