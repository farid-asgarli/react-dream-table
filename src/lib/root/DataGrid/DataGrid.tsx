/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataGridProps, DataGridReference } from "../../types/DataGrid";
import { useCallback, useEffect, useImperativeHandle, useMemo } from "react";
import { DefaultDataGridDimensions } from "../../static/dimensions";
import { DefaultDataGridLocalization } from "../../static/localization";
import { DefaultDataGridTheme } from "../../static/theme";
import { ColumnDefinitionExtended, DataGridStyleProps } from "../../types/Utils";
import { DefaultDataGridIcons } from "../../static/icons";
import { lightenColor } from "../../utils/Coloring";
import useDataGridTools from "../../logic/tools/datagrid-tools";
import DataGridStaticContext from "../../context/DataGridStaticContext";
import DataGridFactory from "../DataGridFactory/DataGridFactory";
import { useDataManagement } from "../../logic/data-management/dataManagement";
import useActionsMenuFactory from "../../logic/tools/actions-menu-factory";
import { renderHeaderActionsMenu } from "../ActionMenus/HeaderActionMenu/HeaderActionMenu";
import { renderFilterFnsActionsMenu } from "../ActionMenus/HeaderActionMenu/FilterFnsMenu";
import "../../styles/theming.css";

function DataGrid<DataType>(tp: DataGridProps<DataType>) {
  const dimensions = useMemo(
    () => ({
      ...DefaultDataGridDimensions,
      ...tp.dimensions,
    }),
    [tp.dimensions]
  );
  const localization = useMemo(() => ({ ...DefaultDataGridLocalization, ...tp.localization }), [tp.localization]);
  const theming = useMemo(() => {
    const themingToInitialize = { ...DefaultDataGridTheme, ...tp.theming };
    return {
      ...themingToInitialize,
      hoverColor: lightenColor(themingToInitialize.primaryColor),
    };
  }, [tp.theming]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const icons = useMemo(() => ({ ...DefaultDataGridIcons, ...tp.icons }), []);

  const defaultStyling: DataGridStyleProps = {
    "--color-primary": theming.primaryColor,
    "--border-radius-lg": theming.borderRadiusLg,
    "--border-radius-md": theming.borderRadiusMd,
    "--border-radius-sm": theming.borderRadiusSm,
    "--box-shadow-main": theming.boxShadow,
    "--color-hover": theming.hoverColor,
    "--scrollbar-width": `${dimensions.defaultScrollbarWidth}px`,
    ...tp.style,
  };

  const tableTools = useDataGridTools({
    tableProps: tp,
    dimensions,
  });

  const dataTools = useDataManagement<DataType>(tp.serverSide !== undefined ? "server" : "client", {
    columns: tp.columns,
    data: tp.data,
    dataCount: tp.serverSide?.pagination?.dataCount,
    paginationDefaults: tp.pagination?.defaults,
    serverSide: tp.serverSide,
    sortingProps: tp.sorting,
  });
  const arePinnedColumnsInUse = useMemo(() => {
    return tp.pinnedColumns?.active && (tableTools.pinnedColumns.left.length > 0 || tableTools.pinnedColumns?.right.length > 0);
  }, [tableTools.pinnedColumns.left.length, tableTools.pinnedColumns?.right.length, tp.pinnedColumns?.active]);

  function initiateColumns() {
    let columnsAggregated: ColumnDefinitionExtended<DataType>[] = [];
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

    const dataColumns = tp.columns
      .filter((col) => tableTools.visibleColumns.has(col.key))
      .sort((a, b) => tableTools.columnOrder.indexOf(a.key) - tableTools.columnOrder.indexOf(b.key))
      .map((col) => ({
        ...col,
        width: tableTools.columnDimensions[col.key as string] ?? dimensions.defaultColumnWidth,
        type: "data",
      })) as ColumnDefinitionExtended<DataType>[];

    columnsAggregated = [...columnsAggregated, ...dataColumns];
    if (tp.rowActionsMenu?.active) {
      columnsAggregated.push({
        key: "actions",
        type: "actions",
        width: dimensions.actionsMenuColumnWidth,
      });
    }
    return columnsAggregated;
  }

  const totalColumns = useMemo<ColumnDefinitionExtended<DataType>[]>(() => {
    const columnsAggregated: ColumnDefinitionExtended<DataType>[] = initiateColumns();
    if (!arePinnedColumnsInUse) return columnsAggregated;
    return columnsAggregated.map((col) => ({
      ...col,
      pinned: tableTools.pinnedColumns.left.includes(col.key)
        ? "left"
        : tableTools.pinnedColumns.right.includes(col.key)
        ? "right"
        : undefined,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tp.selectableRows?.active,
    tp.expandableRows?.active,
    tp.rowActionsMenu?.active,
    tp.columns,
    arePinnedColumnsInUse,
    tableTools.visibleColumns,
    tableTools.columnOrder,
    tableTools.columnDimensions,
    tableTools.pinnedColumns?.left,
    tableTools.pinnedColumns?.right,
    dimensions,
  ]);

  const columnsInUse = useMemo(() => {
    let columns: ColumnDefinitionExtended<DataType>[];
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

  const filterFnsMenuContent = useCallback(
    (key: string, hideMenu: () => void) => renderFilterFnsActionsMenu(key, hideMenu, dataTools, localization),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataTools.currentFilterFns, localization]
  );

  const headerMenuContent = useCallback(
    (key: string, hideMenu: () => void) => renderHeaderActionsMenu(key, hideMenu, tableTools, dataTools, tp, localization, icons),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      tableTools.pinnedColumns,
      tableTools.updateColumnVisibility,
      tableTools.updatePinnedColumns,
      tp.columnVisibilityOptions?.active,
      tp.pinnedColumns?.active,
    ]
  );

  const [dataActionsMenu, _, displayDataActionsMenu] = useActionsMenuFactory(
    (props, hide) => tp.rowActionsMenu?.render?.(props.data as any, tableTools.selectedRows, dataTools.paginationProps, hide) ?? [],
    undefined,
    tp.rowActionsMenu?.onOpen,
    tp.rowActionsMenu?.onHide
  );

  const [headerActionsMenu, __, displayHeaderActionsMenu] = useActionsMenuFactory((props, hide) =>
    headerMenuContent(props.identifier as string, hide)
  );

  const [filterFnsMenu, filterFnsMenuProps, displayFilterFnsMenu] = useActionsMenuFactory(
    (props, hide) => filterFnsMenuContent(props.identifier as string, hide),
    {
      className: "filter-fns-menu",
    }
  );

  useImperativeHandle(
    tp.dataGridApiRef,
    (): DataGridReference<DataType> => ({
      getCurrentData: () => dataTools.dataWithoutPagination,
      getCurrentColumns: () => totalColumns,
      getCurrentFilters: () => dataTools.currentFilters,
      resetCurrentFilters: dataTools.resetCurrentFilters,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataTools.currentFilters, dataTools.dataWithoutPagination, totalColumns]
  );

  useEffect(() => {
    if (tableTools.expandedRowKeys.size > 0) tableTools.closeExpandedRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTools.data]);

  return (
    <DataGridStaticContext.Provider
      value={{
        localization: localization,
        dimensions: dimensions,
        theming: theming,
        icons: icons,
        optionsMenuColumns: tp.columnVisibilityOptions?.defaultValues ?? tp.columns,
        paginationDefaults: tp.pagination?.defaults,
        striped: tp.striped !== false,
        animationProps: {
          duration: 300,
        },
        isRowClickable: !!tp.onRowClick,
        virtualizationEnabled: tp.virtualization?.active === true,
      }}
    >
      <DataGridFactory
        theme="light"
        columnsInUse={columnsInUse}
        pinnedColumns={pinnedColumnsInUse}
        totalColumnsWidth={tbodyInnerWidth}
        tp={tp}
        style={defaultStyling}
        initiateColumns={initiateColumns}
        dataTools={dataTools}
        tableTools={tableTools}
        displayDataActionsMenu={displayDataActionsMenu}
        displayHeaderActionsMenu={displayHeaderActionsMenu}
        filterFnsMenu={{
          displayFilterFnsMenu,
          activeFilterMenuKey: filterFnsMenuProps.identifier as string,
        }}
      >
        {tp.rowActionsMenu?.active && dataActionsMenu}
        {tp.headerActionsMenu?.active !== false && headerActionsMenu}
        {filterFnsMenu}
      </DataGridFactory>
    </DataGridStaticContext.Provider>
  );
}
export default DataGrid;
