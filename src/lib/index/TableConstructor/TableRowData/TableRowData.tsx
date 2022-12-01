import { TableElementProps } from "../../../types/Table";
import { concatStyles } from "../../../utils/ConcatStyles";
import "./TableRowData.css";
export function TableRowData({
  children,
  className,
  rowProps,
  ...props
}: TableElementProps & {
  rowProps?: {
    width?: string | number | undefined;
  };
}) {
  return (
    <div
      style={{
        minWidth: rowProps?.width,
        maxWidth: rowProps?.width,
        minHeight: 52,
        maxHeight: 52,
      }}
      className={concatStyles("table-row-data", className)}
      {...props}
    >
      <div>{children}</div>
    </div>
  );
}
