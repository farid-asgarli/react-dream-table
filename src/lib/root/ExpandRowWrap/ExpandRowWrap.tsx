import Fade from "../../components/animations/Fade/Fade";
import { useDataGridStaticContext } from "../../context/DataGridStaticContext";
import { ExpandRowProps } from "../../types/Elements";
import { cs } from "../../utils/ConcatStyles";
import "./ExpandRowWrap.css";

export default function ExpandRowWrap({
  expandRowProps: { children, isRowExpanded, showSeparatorLine, basicColumnsWidth, leftOffset },
  className,
  style,
  ...props
}: ExpandRowProps) {
  const { dimensions, animationProps, virtualizationEnabled } = useDataGridStaticContext();

  return (
    <Fade duration={animationProps.duration} visible={isRowExpanded}>
      <div
        style={{
          ...style,
          left: leftOffset,
          width: basicColumnsWidth,
          top: dimensions.defaultDataRowHeight,
          height: virtualizationEnabled ? dimensions.defaultExpandPanelHeight : undefined,
        }}
        className={cs("expand-row-wrap", showSeparatorLine && "show-seperator", className)}
        {...props}
      >
        <div className="expand-row-wrap-inner">
          <div className="content">{children}</div>
        </div>
      </div>
    </Fade>
  );
}
