import { CellContentProps } from "../../types/Elements";
import "./CellContent.css";

export default function CellContent({ tooltipProps, ...props }: CellContentProps) {
  return (
    <div
      className="cell-content"
      title={tooltipProps?.active && typeof props.children === "string" ? props.children : undefined}
      {...props}
    />
  );
}
