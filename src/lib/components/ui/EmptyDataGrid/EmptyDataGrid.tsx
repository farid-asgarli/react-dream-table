import React from "react";
import { useDataGridStaticContext } from "../../../context/DataGridStaticContext";
// import { useDataGridStaticContext } from "../../../context/DataGridStaticContext";
import { cs } from "../../../utils/ConcatStyles";
import Fade from "../../animations/Fade/Fade";
import "./EmptyDataGrid.css";

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
    <Fade visible={visible}>
      <div style={{ ...style, bottom: dimensions.defaultScrollbarWidth }} className={cs("empty-data-grid", className)} {...props}>
        <div className={"empty-data-grid-wrapper"}>
          <icons.Empty className={"empty-icon"} />
          <span className={"empty-text"}>{localization.noResult}</span>
        </div>
      </div>
    </Fade>
  );
}
