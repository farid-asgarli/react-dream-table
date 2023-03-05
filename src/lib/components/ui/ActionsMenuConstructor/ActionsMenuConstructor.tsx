import React, { useMemo, useState } from "react";
import type { ActionsMenuListItem, ActionsMenuProps } from "../../../types/Utils";
import { cs } from "../../../utils/ConcatStyles";
import { useDataGridStaticContext } from "../../../context/DataGridStaticContext";
import { Animations } from "../../animations/Animations";
import { Portal } from "../Portal/Portal";
import ButtonPrimary from "../Buttons/ButtonPrimary/ButtonPrimary";
import "./ActionsMenuConstructor.scss";

export const ActionsMenuConstructor = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & ActionsMenuProps
>(({ children, visible, onHide, className, updatePosition, ...props }, ref) => {
  const MAIN_INDEX = "__action_base";
  const { icons, localization } = useDataGridStaticContext();
  const [activeWindowIndex, setActiveWindowIndex] = useState<string>(MAIN_INDEX);

  const isValidActionMenu = (children: any): children is ActionsMenuListItem[] =>
    !React.isValidElement(children) && Array.isArray(children);

  function generateKey(index: number) {
    return index + "__action_menu_key";
  }

  function updateActiveWindow(index: string) {
    setActiveWindowIndex(index);
  }

  const renderChildren = (children: ActionsMenuListItem[], isSubMenu = false) => {
    let childrenCopy = children;
    if (isSubMenu) {
      childrenCopy = [
        {
          renderCustomComponent: (
            <ButtonPrimary onClick={() => updateActiveWindow(MAIN_INDEX)} className="back-button">
              <icons.ArrowLeft className="button-icon" />
              <span>{localization.goBackTitle}</span>
            </ButtonPrimary>
          ),
          onClick: () => updateActiveWindow(MAIN_INDEX),
          className: "back-button-wrapper",
        },
        ...children,
      ];
    }
    return childrenCopy
      .filter((x) => x !== undefined)
      .map((listItem, i) => {
        if (Object.keys(listItem).length === 0) return <div key={i + "_actions_divider"} className="divider" />;
        const key = generateKey(i);
        return (
          <div tabIndex={i} className={cs("button-wrapper", listItem.className)} key={key}>
            {listItem.renderCustomComponent ? (
              listItem.renderCustomComponent
            ) : (
              <button
                className={cs(listItem?.isSelected && "selected")}
                onClick={listItem?.subMenu ? () => updateActiveWindow(key) : listItem.onClick}
                type="button"
              >
                <span className="button-content">{listItem?.content}</span>
                {listItem.isSelected && <icons.CheckMark className="selected-icon" />}
              </button>
            )}
          </div>
        );
      });
  };

  const generateActionsPortal = useMemo(() => {
    if (isValidActionMenu(children)) {
      const availableSubMenus: JSX.Element[] = [];
      const subMenuIndexes: string[] = [];
      for (let index = 0; index < children.length; index++) {
        const listItem = children[index];
        if (listItem && listItem.subMenu) {
          const key = generateKey(index);
          subMenuIndexes.push(key);
          availableSubMenus.push(
            <Portal.Window key={key} index={key}>
              {renderChildren(listItem.subMenu.items, true)}
            </Portal.Window>
          );
        }
      }
      if (subMenuIndexes.length > 0) {
        availableSubMenus.push(
          <Portal.Window key={MAIN_INDEX} index={MAIN_INDEX}>
            {renderChildren(children)}
          </Portal.Window>
        );

        return (
          <Portal.Container indexOrder={[MAIN_INDEX, ...subMenuIndexes]} activeWindowIndex={activeWindowIndex}>
            {availableSubMenus}
          </Portal.Container>
        );
      }
      return renderChildren(children);
    }
    return children as JSX.Element;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWindowIndex, children]);

  function onMenuHide(visible: boolean) {
    if (MAIN_INDEX !== activeWindowIndex) updateActiveWindow(MAIN_INDEX);
    onHide?.(visible);
  }

  return (
    <Animations.Auto onAnimationFinish={onMenuHide} duration={200} visible={visible}>
      <div ref={ref} className={cs("data-grid-actions-menu-constructor", className)} {...props}>
        <div className="actions-menu-list">{generateActionsPortal}</div>
      </div>
    </Animations.Auto>
  );
});
