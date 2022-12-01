import { TableElementProps } from "../../../types/Table";
import { concatStyles } from "../../../utils/ConcatStyles";
import "./TableHead.css";

export function TableHead({
  children,
  className,
  ...props
}: TableElementProps) {
  return (
    <div className={concatStyles("table-head", className)} {...props}>
      {children}
    </div>
  );
}
