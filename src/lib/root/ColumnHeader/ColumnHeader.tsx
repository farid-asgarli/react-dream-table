import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';
import { useDataGridStaticContext } from '../../context/DataGridStaticContext';
import { ColumnHeaderProps } from '../../types/Elements';
import { GridDataType } from '../../types/Utils';
import { cs } from '../../utils/ConcatStyles';
import ColumnHeaderContent from '../ColumnHeaderContent/ColumnHeaderContent';
import ColumnHeaderFilter from '../ColumnHeaderFilter/ColumnHeaderFilter';
import ColumnHeaderFilterWrapper from '../ColumnHeaderFilterWrapper/ColumnHeaderFilterWrapper';
import ColumnHeaderMenuTool from '../ColumnHeaderMenuTool/ColumnHeaderMenuTool';
import ColumnHeaderUnlocked from '../ColumnHeaderUnlocked/ColumnHeaderUnlocked';
import ColumnResizer from '../ColumnResizer/ColumnResizer';
import './ColumnHeader.scss';

function ColumnHeader<DataType extends GridDataType>({
  resizingProps,
  columnProps,
  draggingProps,
  filterProps,
  filterFnsProps,
  children,
  style,
  className,
  toolBoxes,
  containerHeight,
  isFilterMenuVisible,
  ...props
}: React.HtmlHTMLAttributes<HTMLDivElement> & { 'data-key': string } & ColumnHeaderProps<DataType>) {
  const { dimensions } = useDataGridStaticContext();

  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, active } = useSortable({
    id: columnProps.key,
  });

  const draggableProps = draggingProps?.isDraggable
    ? {
        ref: setActivatorNodeRef,
        ...attributes,
        ...listeners,
      }
    : undefined;

  function referenceHandler(ref: HTMLDivElement | null) {
    // if (typeof resizingRef === "function") {
    //   resizingRef(ref);
    // } else if (resizingRef) {
    //   resizingRef.current = ref;
    // }
    setNodeRef(ref);
  }

  return (
    <div
      ref={referenceHandler}
      className={cs(className, 'column-header', active?.id === columnProps.key && 'dragging', draggingProps?.isDraggable && 'draggable')}
      style={{ transform: CSS.Transform.toString(transform), transition, ...style }}
      role="columnheader"
      {...props}
    >
      <ColumnHeaderUnlocked
        style={{
          minHeight: dimensions.defaultHeadRowHeight,
          maxHeight: dimensions.defaultHeadRowHeight,
        }}
      >
        <ColumnHeaderContent {...draggableProps}>{children}</ColumnHeaderContent>
        {toolBoxes && <ColumnHeaderMenuTool>{toolBoxes}</ColumnHeaderMenuTool>}
      </ColumnHeaderUnlocked>
      {isFilterMenuVisible && (
        <ColumnHeaderFilterWrapper
          style={{
            height: dimensions.defaultHeaderFilterHeight,
          }}
          filterFnsProps={filterFnsProps}
          columnKey={columnProps.key}
        >
          <ColumnHeaderFilter columnKey={columnProps.key} filterProps={filterProps} />
        </ColumnHeaderFilterWrapper>
      )}
      {resizingProps?.isResizable && (
        <ColumnResizer
          columnWidth={columnProps.width}
          updateColumnWidth={resizingProps.updateColumnWidth}
          columnKey={columnProps.key}
          containerHeight={containerHeight}
          updateColumnResizingStatus={resizingProps.updateColumnResizingStatus}
        />
      )}
    </div>
  );
}

export default ColumnHeader;
