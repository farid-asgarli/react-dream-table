/* eslint-disable @typescript-eslint/no-unused-vars */
import { TableProps, TableReference, TableThemeType } from "../../types/Table";
import { useCallback, useImperativeHandle, useMemo, useRef } from "react";
import useTableTools from "../../logic/table-tools";
import TableContext from "../../context/TableContext";
import DataGrid from "../DataGrid/DataGrid";
import { DefaultTableDimensions } from "../../static/dimensions";
import { ContextMenuOverlay } from "../../components/ui/ContextMenu/ContextMenu";
import { useDetectOutsideClick } from "../../hooks/use-detect-outside-click/use-detect-outside-click";
import { DefaultTableLocalization } from "../../static/localization";
import { DefaultTableTheme } from "../../static/theme";
import { useDetectKeyPress } from "../../hooks/use-detect-key-press/use-detect-key-press";
import { ColumnTypeExtended, TableStyleProps } from "../../types/Utils";
import { DefaultTableIcons } from "../../static/icons";
import { lightenColor } from "../../utils/Coloring";
import { SettingsMenu } from "../../components/ui/SettingsMenu/SettingsMenu";
import "../../styles/theming.css";

function Table<DataType>(tp: TableProps<DataType>) {
  const dimensions = useMemo(
    () => ({
      ...DefaultTableDimensions,
      ...tp.dimensions,
    }),
    [tp.dimensions]
  );
  const localization = useMemo(() => ({ ...DefaultTableLocalization, ...tp.localization }), [tp.localization]);
  const theming = useMemo(() => {
    const themingToInitialize = { ...DefaultTableTheme, ...tp.theming };
    return {
      ...themingToInitialize,
      hoverColor: lightenColor(themingToInitialize.primaryColor),
    };
  }, [tp.theming]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const icons = useMemo(() => ({ ...DefaultTableIcons, ...tp.icons }), []);

  const defaultStyling: TableStyleProps = {
    "--color-primary": theming.primaryColor,
    "--border-radius-lg": theming.borderRadiusLg,
    "--border-radius-md": theming.borderRadiusMd,
    "--border-radius-sm": theming.borderRadiusSm,
    "--box-shadow-main": theming.boxShadow,
    "--color-hover": theming.hoverColor,
  };

  const contextMenuRef = useRef<HTMLDivElement>(null);
  const settingsMenuRef = useRef<HTMLDivElement>(null);

  const tools = useTableTools({
    columns: tp.columns,
    tableProps: tp,
  });

  useDetectOutsideClick(
    [
      { key: "context", ref: contextMenuRef },
      { key: "settings", ref: settingsMenuRef },
    ],
    (_, key) => {
      switch (key) {
        case "context":
          tools.hideContextMenu();
          break;
        case "settings":
          tools.hideSettingsMenu();
          break;
      }
    }
  );

  useDetectKeyPress((key) => {
    if (key === "Escape") {
      tools.hideContextMenu();
      tools.hideSettingsMenu();
    }
  });

  const arePinnedColumnsInUse = useMemo(() => {
    return tp.pinnedColumns?.active && (tools.pinnedColumns.left.length > 0 || tools.pinnedColumns?.right.length > 0);
  }, [tools.pinnedColumns.left.length, tools.pinnedColumns?.right.length, tp.pinnedColumns?.active]);

  function initiateColumns() {
    let columnsAggregated: ColumnTypeExtended<DataType>[] = [];
    if (tp.selectableRows?.active) {
      columnsAggregated.push({
        key: "select",
        type: "select",
        width: dimensions.selectionMenuColumnWidth,
      });
    }

    if (tp.expandableRows?.active) {
      columnsAggregated.push({
        key: "expand",
        type: "expand",
        width: dimensions.expandedMenuColumnWidth,
      });
    }

    const dataColumns: ColumnTypeExtended<DataType>[] = tp.columns
      .filter((col) => tools.visibleColumns.has(col.key))
      .sort((a, b) => tools.columnOrder.indexOf(a.key) - tools.columnOrder.indexOf(b.key))
      .map((col) => ({
        ...col,
        width: tools.columnDimensions[col.key] ?? dimensions.defaultColumnWidth,
        type: "data",
      }));

    columnsAggregated = [...columnsAggregated, ...dataColumns];
    if (tp.contextMenu?.active) {
      columnsAggregated.push({
        key: "context",
        type: "context",
        width: dimensions.contextMenuColumnWidth,
      });
    }
    return columnsAggregated;
  }

  const totalColumns = useMemo<ColumnTypeExtended<DataType>[]>(() => {
    const columnsAggregated: ColumnTypeExtended<DataType>[] = initiateColumns();
    if (!arePinnedColumnsInUse) return columnsAggregated;
    return columnsAggregated.map((col) => ({
      ...col,
      pinned: tools.pinnedColumns.left.includes(col.key)
        ? "left"
        : tools.pinnedColumns.right.includes(col.key)
        ? "right"
        : undefined,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tp.selectableRows?.active,
    tp.expandableRows?.active,
    tp.contextMenu?.active,
    tp.columns,
    arePinnedColumnsInUse,
    tools.visibleColumns,
    tools.columnOrder,
    tools.columnDimensions,
    tools.pinnedColumns?.left,
    tools.pinnedColumns?.right,
    dimensions,
  ]);

  const columnsInUse = useMemo(() => {
    let columns: ColumnTypeExtended<DataType>[];
    if (!arePinnedColumnsInUse) columns = totalColumns;
    else columns = totalColumns.filter((col) => !col.pinned);
    return {
      columns,
      totalWidth: columns.reduce((prev, curr) => prev + curr.width, 0),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arePinnedColumnsInUse, totalColumns]);

  const pinnedColumnsInUse = useMemo(() => {
    if (!arePinnedColumnsInUse) return;
    const leftColumns = totalColumns.filter((x) => x.pinned === "left");
    const rightColumns = totalColumns.filter((x) => x.pinned === "right");
    const leftWidth = leftColumns.reduce((prev, curr) => prev + curr.width, 0);
    const rightWidth = rightColumns.filter((x) => x.pinned === "right").reduce((prev, curr) => prev + curr.width, 0);

    return {
      leftColumns,
      rightColumns,
      leftWidth: leftWidth,
      rightWidth: rightWidth,
      totalWidth: leftWidth + rightWidth,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arePinnedColumnsInUse, totalColumns]);

  const tbodyInnerWidth = useMemo(() => totalColumns.reduce((prev, curr) => prev + curr.width, 0), [totalColumns]);

  const renderHeaderMenu = useCallback(
    (key: string) => [
      ...(tp.pinnedColumns?.active === true
        ? [
            {
              content: tools.pinnedColumns.left.includes(key) ? localization.unpinColumn : localization.pinColumnToLeft,
              key: "pin-left",
              onClick: () => {
                tools.handlePinColumn(key, "left");
                tools.hideContextMenu();
              },
            },
            {
              content: tools.pinnedColumns.right.includes(key)
                ? localization.unpinColumn
                : localization.pinColumnToRight,
              key: "pin-right",
              onClick: () => {
                tools.handlePinColumn(key, "right");
                tools.hideContextMenu();
              },
            },
          ]
        : []),
      tp.columnVisibilityOptions?.active && tp.pinnedColumns?.active ? {} : undefined,
      ...(tp.columnVisibilityOptions?.active === true
        ? [
            {
              content: localization.hideColumn,
              key: "hide",
              onClick: () => {
                tools.handleColumnVisibility(key);
                tools.hideContextMenu();
              },
            },
          ]
        : []),
      tp.columnVisibilityOptions?.active || tp.pinnedColumns?.active ? {} : undefined,
      {
        content: "Filterləri təmizlə",
        key: "clear-filters",
        onClick: () => {
          tools.dataTools.resetCurrentFilters();
          tools.hideContextMenu();
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      tools.pinnedColumns,
      tools.handleColumnVisibility,
      tools.handlePinColumn,
      tp.columnVisibilityOptions?.active,
      tp.pinnedColumns?.active,
    ]
  );

  const contextMenuElement = tp.contextMenu?.render && tools.contextMenu && (
    <ContextMenuOverlay
      ref={contextMenuRef}
      elements={
        tools.contextMenu.area === "body"
          ? tp.contextMenu.render(tools.contextMenu.data, tools.selectedRows, tools.dataTools.paginationProps, () =>
              tools.hideContextMenu()
            )
          : renderHeaderMenu((tools.contextMenu?.data as any)["id"])
      }
      style={{
        left: tools.contextMenu.position?.xAxis,
        top: tools.contextMenu.position?.yAxis,
      }}
      visible={tools.contextMenu.visible === true}
      onHide={(visible) => {
        !visible && tools.hideContextMenu(true);
      }}
    />
  );

  useImperativeHandle(
    tp.tableApiRef,
    (): TableReference<DataType> => ({
      getCurrentData: () => tools.dataTools.dataWithoutPagination,
      getCurrentColumns: () => totalColumns,
      getCurrentFilters: () => tools.dataTools.currentFilters,
      resetCurrentFilters: tools.dataTools.resetCurrentFilters,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tools.dataTools.currentFilters, tools.dataTools.dataWithoutPagination, totalColumns]
  );

  return (
    <TableContext.Provider
      value={{
        localization: localization,
        dimensions: dimensions,
        theming: theming,
        icons: icons,
        settingsMenuColumns: tp.columnVisibilityOptions?.defaultValues ?? tp.columns,
        paginationDefaults: tp.pagination?.defaults,
        striped: tp.striped !== false,
        isAnyColumnPinned: arePinnedColumnsInUse === true,
      }}
    >
      <DataGrid
        theme="light"
        columnsInUse={columnsInUse}
        pinnedColumns={pinnedColumnsInUse}
        totalColumnsWidth={tbodyInnerWidth}
        tp={tp}
        style={defaultStyling}
        initiateColumns={initiateColumns}
        tools={tools}
      >
        {tp.columnVisibilityOptions?.active && (
          <SettingsMenu
            ref={settingsMenuRef}
            visible={tools.settingsMenuVisibility?.visible === true}
            style={{
              left: tools.settingsMenuVisibility?.position?.x,
              top: tools.settingsMenuVisibility?.position?.y,
            }}
            handleColumnVisibility={tools.handleColumnVisibility}
            visibleColumnKeys={tools.visibleColumns}
          />
        )}
        {contextMenuElement}
      </DataGrid>
    </TableContext.Provider>
  );
}
export default Table;
