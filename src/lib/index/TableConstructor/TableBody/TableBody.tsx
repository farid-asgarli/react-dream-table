import Fade from "../../../components/animations/Fade/Fade";
import { useTableContext } from "../../../context/TableContext";
import { TableBodyProps } from "../../../types/Utils";
import { concatStyles } from "../../../utils/ConcatStyles";
import "./TableBody.css";

export function TableBody({ children, className, style, ...props }: TableBodyProps) {
  const { tableHeight } = useTableContext();
  return (
    <Fade>
      <div className="table-body">
        <div className={concatStyles("table-body-inner", className)} style={{ ...style, height: tableHeight }} {...props}>
          <div className="table-scroller">
            <div className="table-rows-container">{children}</div>
          </div>
        </div>
      </div>
    </Fade>
  );
}
