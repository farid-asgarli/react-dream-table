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
    <Fade as="div" className={"loading-overlay"} visible={visible} {...props}>
      <div className={"content"}>
        <Spinner />
        <span className={"title"}>{localization.dataLoading}</span>
      </div>
    </Fade>
  );
}
