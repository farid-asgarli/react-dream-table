import type { PropsWithChildren } from "react";
import { DragOverlay, defaultDropAnimationSideEffects } from "@dnd-kit/core";
import type { DropAnimation } from "@dnd-kit/core";
import { createPortal } from "react-dom";

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
};

interface Props {}

export function SortableOverlay({ children }: PropsWithChildren<Props>) {
  return createPortal(
    <DragOverlay dropAnimation={dropAnimationConfig}>{children}</DragOverlay>,
    document.getElementById("root")!
  );
}
