import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import { concatStyles } from "../../../utils/ConcatStyles";
import { CSS } from "@dnd-kit/utilities";
import { TableHeadDataProps } from "../../../types/Utils";
import { TableMeasures } from "../../../static/measures";
import "./TableHeadData.css";

export const TableHeadData = React.forwardRef<
  HTMLDivElement,
  TableHeadDataProps
>(
  (
    {
      children,
      rowProps,
      draggingProps,
      columnKey,
      className,
      style,
      resizingProps,
      toolBoxes,
      ...props
    },
    tableHeadDataRef
  ) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      setActivatorNodeRef,
      transform,
      transition,
    } = useSortable({ id: columnKey });

    const draggableProps = draggingProps?.isDraggable
      ? {
          ref: setActivatorNodeRef,
          ...attributes,
          ...listeners,
        }
      : undefined;

    function referenceHandler(ref: HTMLDivElement | null) {
      if (typeof tableHeadDataRef === "function") {
        tableHeadDataRef(ref);
      } else if (tableHeadDataRef) {
        tableHeadDataRef.current = ref;
      }
      setNodeRef(ref);
    }
    return (
      <div
        ref={referenceHandler}
        style={{
          minHeight: TableMeasures.defaultHeadRowHeight,
          maxHeight: TableMeasures.defaultHeadRowHeight,
          minWidth: rowProps?.width,
          maxWidth: rowProps?.width,
          transform: CSS.Transform.toString(transform),
          transition,
          ...style,
        }}
        className={concatStyles(
          "table-head-data",
          draggingProps?.draggingActive && "column-dragging",
          draggingProps?.isDraggable && "draggable",
          className
        )}
        {...props}
      >
        <div className="table-head-data-inner" {...draggableProps}>
          {children}
        </div>
        <div className="table-head-toolboxes">{toolBoxes}</div>
        {resizingProps?.isResizable && (
          <div
            onMouseDown={(e) => resizingProps?.onMouseDown(columnKey)}
            className={`resize-handle ${
              resizingProps?.activeIndex === columnKey ? "active" : "idle"
            }`}
          />
        )}
      </div>
    );
  }
);
