import { useSortable } from "@dnd-kit/sortable";
import { concatStyles } from "../../../utils/ConcatStyles";
import { TableHeadDataProps } from "../../../types/Utils";
import { TableConstans } from "../../../static/constants";
import { useTableContext } from "../../../context/TableContext";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import "./TableHeadData.css";
import AlternativeFilterMenu from "../../../components/ui/FilterMenu/Alternative/AlternativeFilterMenu";

export const TableHeadData = React.forwardRef<HTMLDivElement, TableHeadDataProps>(
  (
    {
      children,
      rowProps,
      draggingProps,
      columnKey,
      className,
      style,
      resizingProps,
      alternateFilterInputProps,
      toolBoxes,
      ...props
    },
    tableHeadDataRef
  ) => {
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable({
      id: columnKey,
    });

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

    const { tableDimensions } = useTableContext();

    return (
      <div
        ref={referenceHandler}
        style={{
          minHeight: tableDimensions.defaultHeadRowHeight,
          maxHeight: tableDimensions.defaultHeadRowHeight,
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
        <div className="table-head-data-wrapper">
          <div className="table-head-display">
            <div className="table-head-data-inner" {...draggableProps}>
              {children}
            </div>
            <div className="table-head-toolboxes">{toolBoxes}</div>
          </div>
          {alternateFilterInputProps &&
            columnKey !== TableConstans.CONTEXT_MENU_KEY &&
            columnKey !== TableConstans.EXPANDABLE_KEY &&
            columnKey !== TableConstans.SELECTION_KEY && (
              <AlternativeFilterMenu
                progressReporters={alternateFilterInputProps.progressReporters}
                columnKey={columnKey}
                filterInputProps={alternateFilterInputProps}
              />
            )}
        </div>
        {resizingProps?.isResizable && (
          <div
            onMouseDown={() => resizingProps?.onMouseDown(columnKey)}
            className={`resize-handle ${resizingProps?.activeIndex === columnKey ? "active" : "idle"}`}
          />
        )}
      </div>
    );
  }
);
