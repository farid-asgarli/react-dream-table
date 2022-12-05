import LoadingOverlay from "../../../components/ui/LoadingOverlay/LoadingOverlay";
import { useTableContext } from "../../../context/TableContext";
import { TableBodyProps } from "../../../types/Utils";
import { concatStyles } from "../../../utils/ConcatStyles";
import "./TableBody.css";

export function TableBody({ children, className, loadingVisible, style, ...props }: TableBodyProps) {
  const { tableHeight } = useTableContext();
  return (
    <div className="table-body">
      <LoadingOverlay visible={loadingVisible} />
      <div className={concatStyles("table-body-inner", className)} style={{ ...style, height: tableHeight }} {...props}>
        <div className="table-scroller">
          <div className="table-rows-container">{children}</div>
        </div>
      </div>
    </div>
  );
}
