import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { useDataGridContext } from "../../context/DataGridContext";
import { ColumnHeaderProps } from "../../types/Elements";
import { cs } from "../../utils/ConcatStyles";
import ColumnHeaderContent from "../ColumnHeaderContent/ColumnHeaderContent";
import ColumnHeaderFilter from "../ColumnHeaderFilter/ColumnHeaderFilter";
import ColumnHeaderFilterWrapper from "../ColumnHeaderFilterWrapper/ColumnHeaderFilterWrapper";
import ColumnHeaderMenuTool from "../ColumnHeaderMenuTool/ColumnHeaderMenuTool";
import ColumnHeaderUnlocked from "../ColumnHeaderUnlocked/ColumnHeaderUnlocked";
import ColumnResizer from "../ColumnResizer/ColumnResizer";
import "./ColumnHeader.css";

function ColumnHeader<DataType>(
  {
    resizingProps,
    columnProps,
    draggingProps,
    filterProps,
    filterFnsProps,
    children,
    style,
    className,
    toolBoxes,
    ...props
  }: React.HtmlHTMLAttributes<HTMLDivElement> & ColumnHeaderProps<DataType>,
  resizingRef: React.ForwardedRef<HTMLDivElement>
) {
  const { dimensions } = useDataGridContext();

  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, active } = useSortable({
    id: columnProps.key as string,
  });

  const draggableProps = draggingProps?.isDraggable
    ? {
        ref: setActivatorNodeRef,
        ...attributes,
        ...listeners,
      }
    : undefined;

  function referenceHandler(ref: HTMLDivElement | null) {
    if (typeof resizingRef === "function") {
      resizingRef(ref);
    } else if (resizingRef) {
      resizingRef.current = ref;
    }
    setNodeRef(ref);
  }

  return (
    <div
      ref={referenceHandler}
      className={cs(
        className,
        "column-header",
        active?.id === columnProps.key && "dragging",
        draggingProps?.isDraggable && "draggable"
      )}
      style={{ transform: CSS.Transform.toString(transform), transition, ...style }}
      {...props}
    >
      <ColumnHeaderUnlocked
        style={{
          maxWidth: columnProps.width,
          minHeight: dimensions.defaultHeadRowHeight,
          maxHeight: dimensions.defaultHeadRowHeight,
        }}
      >
        <ColumnHeaderContent {...draggableProps}>{children}</ColumnHeaderContent>
        {toolBoxes && <ColumnHeaderMenuTool>{toolBoxes}</ColumnHeaderMenuTool>}
      </ColumnHeaderUnlocked>
      <ColumnHeaderFilterWrapper
        style={{
          height: dimensions.defaultHeaderFilterHeight,
        }}
        filterFnsProps={filterFnsProps}
        columnKey={columnProps.key as string}
      >
        <ColumnHeaderFilter columnKey={columnProps.key as string} filterProps={filterProps} />
      </ColumnHeaderFilterWrapper>
      {resizingProps?.isResizable && (
        <ColumnResizer
          className={cs(resizingProps.activeIndex === columnProps.key && "active")}
          onMouseDown={() => resizingProps?.onMouseDown(columnProps.key as string)}
        />
      )}
    </div>
  );
}

export default React.forwardRef(ColumnHeader);
