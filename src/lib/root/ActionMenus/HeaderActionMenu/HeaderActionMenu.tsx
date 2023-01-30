import { TableIconsType, TableLocalizationType, TableProps } from "../../../types/Table";

export const renderHeaderActionsMenu = (
  key: string,
  hideMenu: () => void,
  tableTools: any,
  dataTools: any,
  tp: TableProps<any>,
  localization: TableLocalizationType,
  icons: TableIconsType
) => {
  return [
    ...(tp.pinnedColumns?.active === true
      ? [
          {
            symbol: tableTools.pinnedColumns.left.includes(key) ? icons.Unpin : icons.PinLeft,
            label: tableTools.pinnedColumns.left.includes(key)
              ? localization.unpinColumn
              : localization.pinColumnToLeft,
            key: "pin-left",
            onClick: () => {
              tableTools.updatePinnedColumns(key, "left");
              hideMenu();
            },
          },
          {
            symbol: tableTools.pinnedColumns.right.includes(key) ? icons.Unpin : icons.PinRight,
            label: tableTools.pinnedColumns.right.includes(key)
              ? localization.unpinColumn
              : localization.pinColumnToRight,
            key: "pin-right",
            onClick: () => {
              tableTools.updatePinnedColumns(key, "right");
              hideMenu();
            },
          },
        ]
      : []),
    tp.columnVisibilityOptions?.active && tp.pinnedColumns?.active ? {} : undefined,
    ...(tp.columnVisibilityOptions?.active === true
      ? [
          {
            symbol: icons.Hidden,
            label: localization.hideColumn,
            key: "hide",
            onClick: () => {
              tableTools.updateColumnVisibility(key);
              hideMenu();
            },
          },
        ]
      : []),
    tp.columnVisibilityOptions?.active || tp.pinnedColumns?.active ? {} : undefined,
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
