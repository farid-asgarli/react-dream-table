import { TableDimensions } from "../../../static/measures";
import { TableRowDataProps } from "../../../types/Utils";
import { concatStyles } from "../../../utils/ConcatStyles";
import "./TableRowData.css";
export function TableRowData({ children, className, rowProps, ...props }: TableRowDataProps) {
  return (
    <div
      style={{
        minHeight: TableDimensions.defaultDataRowHeight,
        maxHeight: TableDimensions.defaultDataRowHeight,
        minWidth: rowProps?.width,
        maxWidth: rowProps?.width,
      }}
      className={concatStyles("table-row-data", className)}
      {...props}
    >
      <div>{children}</div>
    </div>
  );
}
