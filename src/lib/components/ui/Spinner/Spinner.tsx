import { cs } from "../../../utils/ConcatStyles";
import "./Spinner.scss";
const Spinner: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    size?: number;
  }
> = ({ className, children, size = 32, style, ...props }) => {
  const dimensions: React.CSSProperties = {
    width: size,
    height: size,
  };

  return (
    <div
      className={cs("spinner-body", className)}
      style={{
        ...style,
        minWidth: size,
        maxWidth: size,
      }}
      {...props}
    >
      <div
        className="spinner"
        style={{
          left: `calc(50vw - calc(${size}px / 2px))`,
          ...dimensions,
        }}
      >
        <svg className="spinner-icon" viewBox="0 0 24 24" style={dimensions}>
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
