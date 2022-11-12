import React from "react";
import { ContextLocalization } from "../../../types/Table";
import Fade from "../../animations/Fade/Fade";
import Spinner from "../Spinner/Spinner";
import styles from "./LoadingOverlay.module.css";
export default function LoadingOverlay({
  visible,
  localization,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  visible: boolean;
  localization: ContextLocalization;
}) {
  return (
    <Fade className={styles.LoadingOverlay} visible={visible} {...props}>
      <div className={styles.Content}>
        <Spinner />
        <span className={styles.Title}>{localization.dataLoading}</span>
      </div>
    </Fade>
  );
}
