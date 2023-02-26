import React from "react";
import { HtmlHTMLAttributes, useMemo, useRef, useState } from "react";
import { ActionsMenuConstructor } from "../../components/ui/ActionsMenuConstructor/ActionsMenuConstructor";
import { useDetectKeyPress } from "../../hooks/use-detect-key-press/use-detect-key-press";
import { useDetectOutsideClick } from "../../hooks/use-detect-outside-click/use-detect-outside-click";
import { ActionsMenuListItem } from "../../types/Utils";

export type ScreenPosition = {
  xAxis: number;
  yAxis: number;
};

export type DisplayActionsMenu<DataType> = ({
  identifier,
  position,
  data,
}: {
  identifier: string;
  position: ScreenPosition;
  data: DataType;
}) => void;

type ActionsMenuVisibilityProps<TData> = {
  visible: boolean;
  position: ScreenPosition | undefined;
  identifier: string | undefined;
  data: TData | undefined;
};

type ActionsMenuBodyProps = Pick<HtmlHTMLAttributes<HTMLDivElement>, "style" | "className">;

export default function useActionsMenuFactory<TData>(
  factory: (
    props: ActionsMenuVisibilityProps<TData>,
    hide: () => void,
    updatePosition: () => void
  ) => React.ReactNode | (ActionsMenuListItem | undefined)[],
  bodyProps?: ActionsMenuBodyProps,
  onOpen?: (data: TData) => void,
  onHide?: () => void
) {
  const emptyState: ActionsMenuVisibilityProps<TData> = {
    data: undefined,
    visible: false,
    identifier: undefined,
    position: undefined,
  };

  const [actionsMenuProps, setActionsMenuProps] = useState<ActionsMenuVisibilityProps<TData>>(emptyState);

  const actionsMenuRef = useRef<HTMLDivElement>(null);

  function displayActionsMenu({ identifier, position, data }: { identifier: string; position: ScreenPosition; data: TData }) {
    onOpen?.(data);
    setActionsMenuProps((prev) => ({
      data,
      position: position,
      visible: prev.identifier !== identifier || !prev?.visible,
      identifier,
    }));
  }

  function hideActionsMenu(destroyOnClose: boolean = false) {
    setActionsMenuProps((prev) => (!destroyOnClose ? { ...prev, visible: false } : emptyState));
    onHide?.();
  }

  useDetectOutsideClick(actionsMenuRef, () => hideActionsMenu());

  useDetectKeyPress((key) => key === "Escape" && hideActionsMenu());

  function handleAnimation(visible: boolean) {
    if (!visible) hideActionsMenu(true);
    else updatePosition();
  }

  function adjustPosition(position?: ScreenPosition, width: number = 300, height: number = 300): ScreenPosition {
    if (!position) return { xAxis: 0, yAxis: 0 };

    const widthSpacing = window.innerWidth - position.xAxis;
    const heightSpacing = window.innerHeight - position.yAxis;
    let positionToUpdate = { ...position };

    if (widthSpacing < width) {
      positionToUpdate.xAxis = window.innerWidth - (width + 20);
    }
    if (heightSpacing < height) {
      positionToUpdate.yAxis = window.innerHeight - (height + 20 + (actionsMenuProps?.identifier === "settings" ? 20 : 0));
    }

    return positionToUpdate;
  }

  function updatePosition() {
    const boundingClientProps = actionsMenuRef.current?.getBoundingClientRect();
    if (boundingClientProps) {
      setActionsMenuProps((prev) => {
        return { ...prev, position: adjustPosition(prev.position, boundingClientProps.width, boundingClientProps.height) };
      });
    }
  }

  const renderMenu = useMemo(
    () =>
      actionsMenuProps.data &&
      React.createElement(ActionsMenuConstructor, {
        visible: actionsMenuProps.visible && !!actionsMenuProps.position?.xAxis && !!actionsMenuProps.position?.yAxis,
        style: {
          left: actionsMenuProps.position?.xAxis,
          top: actionsMenuProps.position?.yAxis,
        },
        ref: actionsMenuRef,
        onHide: handleAnimation,
        children: factory(actionsMenuProps, hideActionsMenu, updatePosition),
        updatePosition,
        ...bodyProps,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actionsMenuProps, factory]
  );

  return [renderMenu, actionsMenuProps, displayActionsMenu, hideActionsMenu] as const;
}
