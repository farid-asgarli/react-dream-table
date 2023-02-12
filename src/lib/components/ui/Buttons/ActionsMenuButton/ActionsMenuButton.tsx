import { ButtonHTMLAttributes } from "react";
import { useDataGridStaticContext } from "../../../../context/DataGridStaticContext";
import { cs } from "../../../../utils/ConcatStyles";
import "./ActionsMenuButton.scss";

export default function ActionsMenuButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { icons, localization } = useDataGridStaticContext();
  return (
    <button type="button" title={localization.menuTitle} className={cs("actions-menu-constructor-button", className)} {...props}>
      <icons.MultiDot className={"actions-menu-constructor-icon"} />
    </button>
  );
}
