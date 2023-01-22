import Fade from "../../components/animations/Fade/Fade";
import { useTableContext } from "../../context/TableContext";
import { ExpandRowProps } from "../../types/Elements";
import { cs } from "../../utils/ConcatStyles";
import "./ExpandRowWrap.css";

export default function ExpandRowWrap({ expandRowProps, className, style, ...props }: ExpandRowProps) {
  const { dimensions } = useTableContext();

  return (
    <Fade duration={100} visible={expandRowProps?.isRowExpanded}>
      <div
        style={{
          ...style,
          left: expandRowProps?.leftOffset,
          width: expandRowProps?.basicColumnsWidth,
          top: dimensions.defaultDataRowHeight,
          height: dimensions.defaultExpandPanelHeight,
        }}
        className={cs("expand-row-wrap", expandRowProps?.showSeperatorLine && "show-seperator", className)}
        {...props}
      >
        <div className="expand-row-wrap-inner">
          <div className="content">{expandRowProps?.children}</div>
        </div>
      </div>
    </Fade>
  );
}
