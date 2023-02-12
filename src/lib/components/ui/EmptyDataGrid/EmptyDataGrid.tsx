import React from "react";
import { useDataGridStaticContext } from "../../../context/DataGridStaticContext";
import { cs } from "../../../utils/ConcatStyles";
import { Animations } from "../../animations/Animations";
import "./EmptyDataGrid.scss";

export default function EmptyDataGrid({
  className,
  visible,
  style,
  ...props
}: React.HtmlHTMLAttributes<HTMLDivElement> & {
  visible: boolean;
}) {
  const { localization, icons, dimensions } = useDataGridStaticContext();

  return (
    <Animations.Auto visible={visible}>
      <div style={{ ...style, bottom: dimensions.defaultScrollbarWidth }} className={cs("empty-data-grid", className)} {...props}>
        <div className={"empty-data-grid-wrapper"}>
          <icons.Empty className={"empty-icon"} />
          <span className={"empty-text"}>{localization.noResult}</span>
        </div>
      </div>
    </Animations.Auto>
  );
}
