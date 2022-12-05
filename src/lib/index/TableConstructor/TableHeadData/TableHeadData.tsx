import { useSortable } from "@dnd-kit/sortable";
import React, { useRef, useState } from "react";
import { concatStyles } from "../../../utils/ConcatStyles";
import { CSS } from "@dnd-kit/utilities";
import { TableHeadDataProps } from "../../../types/Utils";
import "./TableHeadData.css";
import { TableConstans } from "../../../static/constants";
import Close from "../../../icons/Close";
import { StringExtensions } from "../../../extensions/String";
import { useTableContext } from "../../../context/TableContext";

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
    const [currentInputValue, setCurrentInputValue] = useState<string | undefined>(
      alternateFilterInputProps?.currentValue ?? StringExtensions.Empty
    );

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
    const inputUpdateTimeout = useRef<NodeJS.Timeout | null>(null);

    function clearUpdateTimeout() {
      if (inputUpdateTimeout.current) clearTimeout(inputUpdateTimeout.current);
      inputUpdateTimeout.current = null;
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
      setCurrentInputValue(e.target.value);
      clearUpdateTimeout();
      inputUpdateTimeout.current = setTimeout(async () => {
        alternateFilterInputProps?.handleChangeFilterInput?.(columnKey, e.target.value);
      }, 600);
    }

    function clearInput() {
      setCurrentInputValue(StringExtensions.Empty);
      alternateFilterInputProps?.handleChangeFilterInput?.(columnKey, StringExtensions.Empty);
    }

    const { tableDimensions, localization } = useTableContext();

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
              <div className="table-head-search">
                <input
                  onChange={handleInputChange}
                  value={currentInputValue}
                  className="search-input"
                  placeholder={localization.alternativeFilterSearchPlaceholder}
                />
                <button
                  type="button"
                  onClick={clearInput}
                  className="clear-button"
                  disabled={!(currentInputValue && currentInputValue.length > 0)}
                >
                  <Close className="clear-icon" />
                </button>
              </div>
            )}
        </div>
        {resizingProps?.isResizable && (
          <div
            onMouseDown={(e) => resizingProps?.onMouseDown(columnKey)}
            className={`resize-handle ${resizingProps?.activeIndex === columnKey ? "active" : "idle"}`}
          />
        )}
      </div>
    );
  }
);
