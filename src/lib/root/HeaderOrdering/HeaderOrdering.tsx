import { Active, closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { DragEndEvent } from '@dnd-kit/core/dist/types';
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { useMemo, useState } from 'react';
import { HeaderOrderingProps } from '../../types/Elements';
import { GridDataType } from '../../types/Utils';
import ColumnHeader from '../ColumnHeader/ColumnHeader';
import { SortableOverlay } from './SortableOverlay';

export default function HeaderOrdering<DataType extends GridDataType>({
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
      const oldIndex = columnOrder.indexOf(active.id as string);
      const newIndex = columnOrder.indexOf(over?.id as string);
      const newArray = arrayMove(columnOrder, oldIndex, newIndex);
      setColumnOrder(newArray);
      onColumnDragged?.(newArray);
    }
    setActive(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={({ active }) => setActive(active)}
      onDragCancel={() => setActive(null)}
    >
      <SortableContext disabled={!draggingEnabled} items={columnOrder.map((x) => ({ id: x as string }))} strategy={horizontalListSortingStrategy}>
        {children}
      </SortableContext>
      <SortableOverlay>
        {activeItem && (
          <ColumnHeader
            data-key={activeItem.key}
            style={{ height: '100%', fontWeight: 700 }}
            className="column-header-dnd-overlay"
            columnProps={activeItem}
          >
            {activeItem.headerRender ? activeItem.headerRender() : activeItem.title}
          </ColumnHeader>
        )}
      </SortableOverlay>
    </DndContext>
  );
}
