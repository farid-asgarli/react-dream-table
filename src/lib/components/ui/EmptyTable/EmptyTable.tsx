import React from "react";
import Empty from "../../../icons/Empty";
import { ContextLocalization } from "../../../types/Table";
import { concatStyles } from "../../../utils/ConcatStyles";

import styles from "./EmptyTable.module.css";

export default function EmptyTable({
  localization,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement> & {
  localization: ContextLocalization;
}) {
  return (
    <div className={concatStyles(styles.EmptyTable)} {...props}>
      <div className={styles.EmptyWrapper}>
        <Empty className={styles.Icon} />
        <span className={styles.Text}>{localization.filterEmpty}</span>
      </div>
    </div>
  );
}
