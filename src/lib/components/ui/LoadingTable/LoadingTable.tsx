import React from "react";
import { concatStyles } from "../../../utils/ConcatStyles";
import Skeleton from "../Skeleton/Skeleton";
import styles from "./LoadingTable.module.css";
export default function LoadingTable(
  props: React.TableHTMLAttributes<HTMLTableElement>
) {
  return (
    <table className={concatStyles(styles.SkeletonTable)} {...props}>
      <tbody>
        {[...Array(10)].map((_, i) => (
          <tr key={i}>
            <td>
              <Skeleton />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
