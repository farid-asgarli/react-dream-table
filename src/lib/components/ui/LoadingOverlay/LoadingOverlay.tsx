import React from "react";
import { useDataGridContext } from "../../../context/DataGridContext";
// import { useDataGridContext } from "../../../context/DataGridContext";
import Fade from "../../animations/Fade/Fade";
import Spinner from "../Spinner/Spinner";
import "./LoadingOverlay.css";
export default function LoadingOverlay({
  visible,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  visible: boolean;
}) {
  const { localization } = useDataGridContext();
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
