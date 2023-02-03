import React, { useMemo } from "react";
import Fade from "../../animations/Fade/Fade";
import type { ActionsMenuListItem, ActionsMenuProps } from "../../../types/Utils";
import { cs } from "../../../utils/ConcatStyles";
import "./ActionsMenu.css";
import { useDataGridStaticContext } from "../../../context/DataGridStaticContext";

export const ActionsMenu = React.forwardRef<HTMLDivElement, Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & ActionsMenuProps>(
  ({ children, visible, onHide, className, ...props }, ref) => {
    const { icons } = useDataGridStaticContext();
    const renderChildren = useMemo(() => {
      if (React.isValidElement(children)) return children;
      else
        return (children as ActionsMenuListItem[])
          ?.filter((x) => x !== undefined)
          .map((elem, i) => {
            if (Object.keys(elem!).length === 0) return <div key={i + "_actions_divider"} className="divider" />;
            return (
              <div tabIndex={i} className="button-wrapper" key={elem?.key}>
                <button className={cs(elem.isSelected && "selected")} key={elem?.key} onClick={elem?.onClick} type="button">
                  <span>{elem?.content}</span>
                  {elem.isSelected && <icons.CheckMark className="selected-icon" />}
                </button>
              </div>
            );
          });
    }, [children, icons]);
    return (
      <Fade onAnimationFinish={onHide} duration={200} visible={visible}>
        <div ref={ref} className={cs("actions-menu", className)} {...props}>
          {renderChildren}
        </div>
      </Fade>
    );
  }
);
