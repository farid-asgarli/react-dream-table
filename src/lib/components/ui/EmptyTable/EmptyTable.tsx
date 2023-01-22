import React from "react";
import { useTableContext } from "../../../context/TableContext";
// import { useTableContext } from "../../../context/TableContext";
import { cs } from "../../../utils/ConcatStyles";
import Fade from "../../animations/Fade/Fade";
import "./EmptyTable.css";

export default function EmptyTable({
  className,
  visible,
  style,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement> & {
  visible: boolean;
}) {
  const { localization, icons } = useTableContext();

  return (
    <Fade visible={visible}>
      <div style={{ ...style }} className={cs("empty-table", className)} {...props}>
        <div className={"empty-table-wrapper"}>
          <icons.Empty className={"empty-icon"} />
          <span className={"empty-text"}>{localization.filterEmpty}</span>
        </div>
      </div>
    </Fade>
  );
}
