import LoadingOverlay from "../../../components/ui/LoadingOverlay/LoadingOverlay";
import { TableBodyProps } from "../../../types/Utils";
import { concatStyles } from "../../../utils/ConcatStyles";
import "./TableBody.css";

export function TableBody({ children, className, localization, loadingVisible, ...props }: TableBodyProps) {
  return (
    <div className="table-body">
      <LoadingOverlay visible={loadingVisible} localization={localization} />
      <div className={concatStyles("table-body-inner", className)} {...props}>
        <div className="table-scroller">
          <div className="table-rows-container">{children}</div>
        </div>
      </div>
    </div>
  );
}
