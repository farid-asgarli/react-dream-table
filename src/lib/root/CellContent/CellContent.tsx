import { CellContentProps } from "../../types/Elements";
import "./CellContent.scss";

export default function CellContent({ tooltipProps, ...props }: CellContentProps) {
  return (
    <div
      className="cell-content"
      title={tooltipProps?.enabled && typeof props.children === "string" ? props.children : undefined}
      {...props}
    />
  );
}
