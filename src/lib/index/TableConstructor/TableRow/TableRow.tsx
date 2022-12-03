import { TableRowProps } from "../../../types/Utils";
import { concatStyles } from "../../../utils/ConcatStyles";
import "./TableRow.css";

export function TableRow({ children, className, ...props }: TableRowProps) {
  return (
    <div className={concatStyles("table-row", className)} {...props}>
      {children}
    </div>
  );
}
