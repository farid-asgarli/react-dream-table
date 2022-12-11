import Fade from "../../../components/animations/Fade/Fade";
import { TableRowProps } from "../../../types/Utils";
import { concatStyles } from "../../../utils/ConcatStyles";
import "./TableRow.css";

export function TableRow({ children, className, expandedProps, ...props }: TableRowProps) {
  return (
    <div className="table-row-wrapper">
      <div className={concatStyles("table-row", className)} {...props}>
        {children}
      </div>
      {expandedProps?.children !== undefined && (
        <Fade duration={200} visible={expandedProps?.isRowExpanded}>
          <div className={concatStyles("table-row-expansion", expandedProps?.showSeperatorLine && "show-seperator")}>
            <div className="table-row-expansion-wrapper">{expandedProps?.children}</div>
          </div>
        </Fade>
      )}
    </div>
  );
}
