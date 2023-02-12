import { ButtonHTMLAttributes } from "react";
import { useDataGridStaticContext } from "../../../../context/DataGridStaticContext";
import { cs } from "../../../../utils/ConcatStyles";
import "./CollapseAllButton.scss";

export default function CollapseAllButton({
  isExpanded,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  isExpanded?: boolean;
}) {
  const { icons, localization } = useDataGridStaticContext();

  return (
    <button
      title={localization.rowShrinkAllTitle}
      type="button"
      className={cs("actions-menu-constructor-button collapse-all-button")}
      {...props}
    >
      <span className="icon-wrapper">
        <icons.ChevronUp className="actions-menu-constructor-icon" />
        <icons.ChevronUp className="actions-menu-constructor-icon" />
      </span>
    </button>
  );
}
