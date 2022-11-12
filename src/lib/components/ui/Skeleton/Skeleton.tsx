import { concatStyles } from "../../../utils/ConcatStyles";
import styles from "./Skeleton.module.css";

export default function Skeleton() {
  return <div className={concatStyles(styles.Line)} />;
}
