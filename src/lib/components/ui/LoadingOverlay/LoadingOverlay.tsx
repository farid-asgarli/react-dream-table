import React from "react";
import { ContextLocalization } from "../../../types/Table";
import Fade from "../../animations/Fade/Fade";
import Spinner from "../Spinner/Spinner";
import "./LoadingOverlay.css";
export default function LoadingOverlay({
  visible,
  localization,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  visible: boolean;
  localization: ContextLocalization;
}) {
  return (
    <Fade visible={visible} {...props}>
      <div className="loading-overlay">
        <div className={"content"}>
          <Spinner />
          <span className={"title"}>{localization.dataLoading}</span>
        </div>
      </div>
    </Fade>
  );
}
