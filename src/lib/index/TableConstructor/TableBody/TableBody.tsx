import LoadingOverlay from "../../../components/ui/LoadingOverlay/LoadingOverlay";
import { ContextLocalization, TableElementProps } from "../../../types/Table";
import { concatStyles } from "../../../utils/ConcatStyles";
import "./TableBody.css";

export function TableBody({
  children,
  className,
  localization,
  loadingVisible,
  ...props
}: TableElementProps & {
  loadingVisible: boolean;
  localization: ContextLocalization;
}) {
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
