import React from "react";
import { useDataGridStaticContext } from "../../../context/DataGridStaticContext";
import { Animations } from "../../animations/Animations";
import Spinner from "../Spinner/Spinner";
import "./LoadingOverlay.scss";
export default function LoadingOverlay({
  visible,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  visible: boolean;
}) {
  const { localization } = useDataGridStaticContext();
  return (
    <Animations.Auto visible={visible}>
      <div className="loading-overlay" {...props}>
        <div className={"content"}>
          <Spinner />
          <span className={"title"}>{localization.dataLoading}</span>
        </div>
      </div>
    </Animations.Auto>
  );
}
