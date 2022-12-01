import "./TableHeadData.css";
import { TableElementProps } from "../../../types/Table";
import { concatStyles } from "../../../utils/ConcatStyles";

export function TableHeadData({
  children,
  rowProps,
  className,
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
        minHeight: 42,
        maxHeight: 42,
      }}
      className={concatStyles("table-head-data", className)}
      {...props}
    >
      <div>{children}</div>
    </div>
  );
}
