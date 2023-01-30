import React from "react";
import { HtmlHTMLAttributes, useMemo, useRef, useState } from "react";
import { ActionsMenu } from "../../components/ui/ActionsMenu/ActionsMenu";
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
  identifier: string | number;
  position: ScreenPosition;
  data: DataType;
}) => void;

type ActionsMenuVisibilityProps<TData> = {
  visible: boolean;
  position: ScreenPosition | undefined;
  identifier: string | number | undefined;
  data: TData | undefined;
};

type ActionsMenuBodyProps = Pick<HtmlHTMLAttributes<HTMLDivElement>, "style" | "className">;

export default function useActionsMenuFactory<TData>(
  factory: (
    props: ActionsMenuVisibilityProps<TData>,
    hide: () => void
  ) => React.ReactNode | (ActionsMenuListItem | undefined)[],
  bodyProps?: ActionsMenuBodyProps
) {
  const emptyState: ActionsMenuVisibilityProps<TData> = {
    data: undefined,
    visible: false,
    identifier: undefined,
    position: undefined,
  };

  const [actionsMenuProps, setActionsMenuProps] = useState<ActionsMenuVisibilityProps<TData>>(emptyState);

  const actionsMenuRef = useRef<HTMLDivElement>(null);

  function displayActionsMenu({
    identifier,
    position,
    data,
  }: {
    identifier: string | number;
    position: ScreenPosition;
    data: TData;
  }) {
    setActionsMenuProps((prev) => {
      return {
        data,
        position: {
          xAxis: position.xAxis,
          yAxis: position.yAxis,
        },
        visible: prev.identifier !== identifier || !prev?.visible,
        identifier,
      };
    });
  }

  function hideActionsMenu(destroyOnClose: boolean = false) {
    setActionsMenuProps((prev) => (!destroyOnClose ? { ...prev, visible: false } : emptyState));
  }

  useDetectOutsideClick(actionsMenuRef, () => hideActionsMenu());

  useDetectKeyPress((key) => key === "Escape" && hideActionsMenu());

  const renderMenu = useMemo(
    () => (
      <ActionsMenu
        ref={actionsMenuRef}
        visible={actionsMenuProps.visible}
        style={{
          left: actionsMenuProps.position?.xAxis,
          top: actionsMenuProps.position?.yAxis,
        }}
        onHide={(visible) => !visible && hideActionsMenu(true)}
        children={factory(actionsMenuProps, hideActionsMenu)}
        {...bodyProps}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actionsMenuProps, factory]
  );

  return [renderMenu, actionsMenuProps, displayActionsMenu, hideActionsMenu] as [
    typeof renderMenu,
    typeof actionsMenuProps,
    typeof displayActionsMenu,
    typeof hideActionsMenu
  ];
}
