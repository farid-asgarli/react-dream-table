import { TableMeasures } from "../../../static/measures";
import { TableRowDataProps } from "../../../types/Utils";
import { concatStyles } from "../../../utils/ConcatStyles";
import "./TableRowData.css";
export function TableRowData({ children, className, rowProps, ...props }: TableRowDataProps) {
  return (
    <div
      style={{
        minHeight: TableMeasures.defaultDataRowHeight,
        maxHeight: TableMeasures.defaultDataRowHeight,
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
