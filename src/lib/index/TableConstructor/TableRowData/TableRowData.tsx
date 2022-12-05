import { useTableContext } from "../../../context/TableContext";
import { TableRowDataProps } from "../../../types/Utils";
import { concatStyles } from "../../../utils/ConcatStyles";
import "./TableRowData.css";
export function TableRowData({ children, className, rowProps, ...props }: TableRowDataProps) {
  const { tableDimensions } = useTableContext();
  return (
    <div
      style={{
        minHeight: tableDimensions.defaultDataRowHeight,
        maxHeight: tableDimensions.defaultDataRowHeight,
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
