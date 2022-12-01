import { TableElementProps } from "../../../types/Table";
import { concatStyles } from "../../../utils/ConcatStyles";
import "./TableRow.css";

export function TableRow({ children, className, ...props }: TableElementProps) {
  return (
    <div className={concatStyles("table-row", className)} {...props}>
      {children}
    </div>
  );
}
