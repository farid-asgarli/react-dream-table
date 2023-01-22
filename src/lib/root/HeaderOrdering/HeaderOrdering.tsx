import { Active, closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { DragEndEvent } from "@dnd-kit/core/dist/types";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { useTableContext } from "../../context/TableContext";
import { HeaderOrderingProps } from "../../types/Elements";
import { ColumnTypeExtended } from "../../types/Utils";
import ColumnHeader from "../ColumnHeader/ColumnHeader";
import "./HeaderOrdering.css";
import { SortableOverlay } from "./SortableOverlay";

export default function HeaderOrdering<DataType>({
  columnOrder,
  columns,
  setColumnOrder,
  draggingEnabled,
  onColumnDragged,
  children,
}: HeaderOrderingProps<DataType>) {
  const [active, setActive] = useState<Active | null>(null);

  const activeItem = useMemo(() => columns.find((item) => item.key === active?.id), [active?.id, columns]);

  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setColumnOrder((items) => {
        const oldIndex = items.indexOf(active.id as any);
        const newIndex = items.indexOf(over?.id as any);
        const newArray = arrayMove(items, oldIndex, newIndex);
        onColumnDragged?.(newArray);
        return newArray;
      });
    }
    setActive(null);
  }
  const {
    dimensions: { defaultHeadRowHeight },
  } = useTableContext();
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={({ active }) => setActive(active)}
      onDragCancel={() => setActive(null)}
    >
      <SortableContext
        disabled={!draggingEnabled}
        items={columnOrder.map((x) => ({ id: x as string }))}
        strategy={horizontalListSortingStrategy}
      >
        {children}
      </SortableContext>
      <SortableOverlay>
        {activeItem && (
          <ColumnHeader
            style={{ height: defaultHeadRowHeight }}
            className="column-header-dnd-overlay"
            columnProps={activeItem as ColumnTypeExtended<unknown>}
          >
            {activeItem.headerRender ? activeItem.headerRender() : activeItem.title}
          </ColumnHeader>
        )}
      </SortableOverlay>
    </DndContext>
  );
}
