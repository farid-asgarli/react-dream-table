import { DataGridIconsDefinition, DataGridLocalizationDefinition, DataGridProps } from "../../../types/DataGrid";
import "./../ActionMenus.scss";

export const renderHeaderActionsMenu = (
  key: string,
  hideMenu: () => void,
  gridTools: any,
  dataTools: any,
  gridProps: DataGridProps<any>,
  localization: DataGridLocalizationDefinition,
  icons: DataGridIconsDefinition
) => {
  return [
    ...(gridProps.pinnedColumns?.enabled === true
      ? [
          {
            symbol: gridTools.pinnedColumns.left.includes(key) ? icons.Unpin : icons.PinLeft,
            label: gridTools.pinnedColumns.left.includes(key) ? localization.unpinColumn : localization.pinColumnToLeft,
            key: "pin-left",
            onClick: () => {
              gridTools.updatePinnedColumns(key, "left");
              hideMenu();
            },
          },
          {
            symbol: gridTools.pinnedColumns.right.includes(key) ? icons.Unpin : icons.PinRight,
            label: gridTools.pinnedColumns.right.includes(key) ? localization.unpinColumn : localization.pinColumnToRight,
            key: "pin-right",
            onClick: () => {
              gridTools.updatePinnedColumns(key, "right");
              hideMenu();
            },
          },
        ]
      : []),
    gridProps.columnVisibilityOptions?.enabled && gridProps.pinnedColumns?.enabled ? {} : undefined,
    ...(gridProps.columnVisibilityOptions?.enabled === true
      ? [
          {
            symbol: icons.Hidden,
            label: localization.hideColumn,
            key: "hide",
            onClick: () => {
              gridTools.updateColumnVisibility(key);
              hideMenu();
            },
          },
        ]
      : []),
    gridProps.columnVisibilityOptions?.enabled || gridProps.pinnedColumns?.enabled ? {} : undefined,
    {
      symbol: icons.ClearFilters,
      label: localization.clearFilers,
      key: "clear-filters",
      onClick: () => {
        dataTools.resetCurrentFilters();
        hideMenu();
      },
    },
  ].map((it) => {
    if (it && Object.keys(it).length > 0) {
      return {
        ...it,
        content: (
          <div className="content-wrapper">
            {it.symbol && <it.symbol className="symbol-icon" />}
            <span>{it.label}</span>
          </div>
        ),
      };
    }
    return it;
  });
};
