import { useRef } from "react";
import { Animations } from "../../components/animations/Animations";
import { useDataGridStaticContext } from "../../context/DataGridStaticContext";
import { ExpandRowProps } from "../../types/Elements";
import { cs } from "../../utils/ConcatStyles";
import "./ExpandRowWrap.scss";

export default function ExpandRowWrap({
  expandRowProps: { children, isRowExpanded, showSeparatorLine, updateExpandRowHeightCache, rowIndex },
  className,
  style,
  ...props
}: ExpandRowProps) {
  const { animationProps } = useDataGridStaticContext();

  const ref = useRef<HTMLDivElement | null>(null);

  //TODO
  function onAnimationFinish(visible: boolean) {
    if (updateExpandRowHeightCache && visible)
      setTimeout(() => updateExpandRowHeightCache?.(rowIndex, ref.current?.getBoundingClientRect().height ?? 0), 0);
  }

  return (
    <Animations.Auto onAnimationFinish={onAnimationFinish} duration={animationProps.duration} visible={isRowExpanded}>
      <div className={cs("expand-row-wrap", showSeparatorLine && "show-separator", className)} {...props}>
        <div ref={ref} className="expand-row-wrap-inner">
          <div className="content">{children}</div>
        </div>
      </div>
    </Animations.Auto>
  );
}
