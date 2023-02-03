import React from "react";
import { useDataGridStaticContext } from "../../../context/DataGridStaticContext";
// import { useDataGridStaticContext } from "../../../context/DataGridStaticContext";
import Fade from "../../animations/Fade/Fade";
import Spinner from "../Spinner/Spinner";
import "./LoadingOverlay.css";
export default function LoadingOverlay({
  visible,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  visible: boolean;
}) {
  const { localization } = useDataGridStaticContext();
  return (
    <Fade visible={visible}>
      <div className="loading-overlay" {...props}>
        <div className={"content"}>
          <Spinner />
          <span className={"title"}>{localization.dataLoading}</span>
        </div>
      </div>
    </Fade>
  );
}
