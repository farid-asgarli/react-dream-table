type DragPosition = {
    xAxis: number;
};
type DraggableHookDefinition = (hookProps: {
    onDrag?: (position: DragPosition) => DragPosition;
    onDragEnd?: (position: DragPosition) => void;
}) => [(elem: HTMLElement | null) => void, boolean];
/**
 * Another resizing hook to adjust width and also drag element on x-axis.
 * Calculation is carried out by the tools to whether set the width or not.
 * Performant solution, based on movementX.
 * Does not cause stutter.
 */
export declare const useDraggable: DraggableHookDefinition;
export {};
