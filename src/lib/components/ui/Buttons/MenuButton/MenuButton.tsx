import React from "react";
import { useDataGridContext } from "../../../../context/DataGridContext";
import { cs } from "../../../../utils/ConcatStyles";

export default function MenuButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { icons, localization } = useDataGridContext();
  return (
    <button type="button" title={localization.menuTitle} className={cs("action-button")} {...props}>
      <icons.ThreeDots
        style={{
          transform: "rotate(90deg)",
        }}
        className={cs("action-icon")}
      />
    </button>
  );
}
