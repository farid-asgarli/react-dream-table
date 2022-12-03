import React, { useMemo, useState } from "react";
import { concatStyles } from "../../../utils/ConcatStyles";
import "./TableHead.css";
import { DndContext, closestCenter, PointerSensor, useSensors, DragEndEvent, useSensor, Active } from "@dnd-kit/core";
import { arrayMove, SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { TableHeadData } from "../TableHeadData/TableHeadData";
import { SortableOverlay } from "../TableColumnSort/SortableOverlay";
import { TableHeadProps } from "../../../types/Utils";

export const TableHead = React.forwardRef<HTMLDivElement, TableHeadProps>(
  ({ children, className, setColumnOrder, items, draggingEnabled, ...props }, headRef) => {
    const sensors = useSensors(useSensor(PointerSensor));
    function handleDragEnd(event: DragEndEvent) {
      const { active, over } = event;

      if (active.id !== over?.id) {
        setColumnOrder((items) => {
          const oldIndex = items.indexOf(active.id as any);
          const newIndex = items.indexOf(over?.id as any);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
      setActive(null);
    }

    const [active, setActive] = useState<Active | null>(null);
    const activeItem = useMemo(() => items.find((item) => item.columnKey === active?.id), [active, items]);

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={({ active }) => setActive(active)}
        onDragCancel={() => setActive(null)}
        autoScroll
      >
        <SortableContext
          disabled={!draggingEnabled}
          items={items.map((x) => ({ id: x.columnKey }))}
          strategy={horizontalListSortingStrategy}
        >
          <div ref={headRef} className={concatStyles("table-head", className)} {...props}>
            {items.map((dat) => (
              <TableHeadData
                {...dat}
                draggingProps={{
                  ...dat.draggingProps,
                  draggingActive: active?.id === dat.columnKey,
                }}
              />
            ))}
          </div>
        </SortableContext>
        <SortableOverlay>{activeItem && <TableHeadData {...activeItem} />}</SortableOverlay>
      </DndContext>
    );
  }
);
