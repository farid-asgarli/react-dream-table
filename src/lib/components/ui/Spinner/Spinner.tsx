import { concatStyles } from "../../../utils/ConcatStyles";
import styles from "./Spinner.module.css";
const Spinner: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    size?: number;
  }
> = ({ className, children, size = 32, ...props }) => {
  const dimensions: React.CSSProperties = {
    width: size,
    height: size,
  };

  return (
    <div className={concatStyles(styles.Body, className)} {...props}>
      <div
        className={styles.Spinner}
        style={{
          left: `calc(50vw - calc(${32}px / 2px))`,
          ...dimensions,
        }}
      >
        <svg
          className={styles.SpinnerIcon}
          viewBox="0 0 24 24"
          style={dimensions}
        >
          <path
            d="M 22.49772,12.000001 A 10.49772,10.497721 0 0 1 12,22.497722 10.49772,10.497721 0 0 1 1.5022797,12.000001 10.49772,10.497721 0 0 1 12,1.5022797 10.49772,10.497721 0 0 1 22.49772,12.000001 Z"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};
export default Spinner;
