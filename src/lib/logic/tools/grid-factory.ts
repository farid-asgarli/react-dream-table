import { useCallback, useMemo } from "react";
import { ConstProps } from "../../static/constantProps";
import { DefaultDataGridDimensions } from "../../static/dimensions";
import { DefaultDataGridIcons } from "../../static/icons";
import { LocalizationEntries } from "../../static/localization";
import { DefaultDataGridTheme } from "../../static/theme";
import { DataGridProps } from "../../types/DataGrid";
import { DataGridStyleProps, ColumnDefinitionExtended, GridDataType, GridTools, GroupedColumnHeaderDefinition } from "../../types/Utils";
import { lightenColor } from "../../utils/Coloring";
import { useDataManagement } from "../data-management/dataManagement";
import useDataGridTools from "./data-grid-tools";

export function useGridFactory<DataType extends GridDataType>(gridProps: DataGridProps<DataType>) {
  const dimensions = useMemo(
    () => ({
      ...DefaultDataGridDimensions,
      ...gridProps.dimensions,
    }),
    [gridProps.dimensions]
  );

  const localization = useMemo(() => {
    if (gridProps.localization?.defaultLocale) {
      return { ...LocalizationEntries[gridProps.localization?.defaultLocale], ...gridProps.localization?.customLocaleProps };
    }
    return { ...LocalizationEntries[ConstProps.defaultLocale], ...gridProps.localization?.customLocaleProps };
  }, [gridProps.localization]);

  const styling = useMemo(() => {
    const stylingToInitialize = { ...DefaultDataGridTheme, ...gridProps.styling };
    return {
      ...stylingToInitialize,
      hoverColor: lightenColor(stylingToInitialize.primaryColor),
    };
  }, [gridProps.styling]);
  const icons = useMemo(() => ({ ...DefaultDataGridIcons, ...gridProps.icons }), [gridProps.icons]);

  const defaultStyling: DataGridStyleProps = useMemo(
    () => ({
      "--grid-color-primary": styling.primaryColor,
      "--grid-border-radius-lg": styling.borderRadiusLg,
      "--grid-border-radius-md": styling.borderRadiusMd,
      "--grid-border-radius-sm": styling.borderRadiusSm,
      "--grid-box-shadow-main": styling.boxShadow,
      "--grid-color-hover": styling.hoverColor,
      "--grid-scrollbar-width": `${dimensions.defaultScrollbarWidth}px`,
      ...gridProps.style,
    }),
    [
      dimensions.defaultScrollbarWidth,
      styling.borderRadiusLg,
      styling.borderRadiusMd,
      styling.borderRadiusSm,
      styling.boxShadow,
      styling.hoverColor,
      styling.primaryColor,
      gridProps.style,
    ]
  );

  const gridTools: GridTools<DataType> = useDataGridTools({
    tableProps: gridProps,
    dimensions,
  }) as GridTools<DataType>;

  const dataTools = useDataManagement<DataType>(gridProps.serverSide?.enabled === true ? "server" : "client", {
    columns: gridProps.columns,
    data: gridProps.data,
    dataCount: gridProps.serverSide?.pagination?.dataCount,
    paginationProps: gridProps.pagination,
    serverSide: gridProps.serverSide,
    sortingProps: gridProps.sorting,
  });

  const arePinnedColumnsInUse = useMemo(() => {
    return gridProps.pinnedColumns?.enabled && (gridTools.pinnedColumns.left.length > 0 || gridTools.pinnedColumns?.right.length > 0);
  }, [gridTools.pinnedColumns.left.length, gridTools.pinnedColumns?.right.length, gridProps.pinnedColumns?.enabled]);

  const initializedColumns = useMemo(() => {
    const columnsAggregated: ColumnDefinitionExtended<DataType>[] = [];

    if (gridProps.rowSelection?.enabled) {
      columnsAggregated.push({
        key: "select",
        type: "select",
        width: dimensions.selectionMenuColumnWidth,
      });
    }

    if (gridProps.expandableRows?.enabled) {
      columnsAggregated.push({
        key: "expand",
        type: "expand",
        width: dimensions.expandedMenuColumnWidth,
      });
    }

    const dataColumns = gridProps.columns
      .filter((col) => gridTools.visibleColumns.has(col.key))
      .sort((a, b) => gridTools.columnOrder.indexOf(a.key) - gridTools.columnOrder.indexOf(b.key))
      .map((col) => ({
        ...col,
        width: gridTools.columnDimensions[col.key as string] ?? dimensions.defaultColumnWidth,
        type: "data",
      })) as ColumnDefinitionExtended<DataType>[];

    columnsAggregated.push(...dataColumns);

    if (gridProps.rowActionsMenu?.enabled) {
      columnsAggregated.push({
        key: "actions",
        type: "actions",
        width: dimensions.actionsMenuColumnWidth,
      });
    }

    return columnsAggregated;
  }, [
    gridTools.columnDimensions,
    gridTools.columnOrder,
    gridTools.visibleColumns,
    dimensions.actionsMenuColumnWidth,
    dimensions.defaultColumnWidth,
    dimensions.expandedMenuColumnWidth,
    dimensions.selectionMenuColumnWidth,
    gridProps.columns,
    gridProps.expandableRows?.enabled,
    gridProps.rowActionsMenu?.enabled,
    gridProps.rowSelection?.enabled,
  ]);

  const totalColumns = useMemo<ColumnDefinitionExtended<DataType>[]>(() => {
    if (!arePinnedColumnsInUse) return initializedColumns;
    return initializedColumns.map((col) => ({
      ...col,
      pinned: gridTools.pinnedColumns.left.includes(col.key)
        ? "left"
        : gridTools.pinnedColumns.right.includes(col.key)
        ? "right"
        : undefined,
    }));
  }, [initializedColumns, arePinnedColumnsInUse, gridTools.pinnedColumns.left, gridTools.pinnedColumns.right]);

  const columnsToRender = useMemo(() => {
    let columns: ColumnDefinitionExtended<DataType>[];
    if (!arePinnedColumnsInUse) columns = totalColumns;
    else columns = totalColumns.filter((col) => !col.pinned);
    return {
      columns,
      totalWidth: columns.reduce((prev, curr) => prev + curr.width, 0),
    };
  }, [arePinnedColumnsInUse, totalColumns]);

  const pinnedColumnsToRender = useMemo(() => {
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
  }, [arePinnedColumnsInUse, totalColumns]);

  const totalColumnsWidth = useMemo(() => totalColumns.reduce((prev, curr) => prev + curr.width, 0), [totalColumns]);

  const colKeysMappedToGroup = useMemo(() => {
    if (!gridTools.isColumnGroupingEnabled) return;
    const colGroupDictionary: Record<string, string | undefined> = {};
    for (let index = 0; index < gridProps.columns.length; index++) {
      const column = gridProps.columns[index];
      colGroupDictionary[column.key as string] = gridProps.groupedColumns?.groups?.find((x) => x.columnKeys.includes(column.key))?.title;
    }
    return colGroupDictionary;
  }, [gridTools.isColumnGroupingEnabled, gridProps.columns, gridProps.groupedColumns?.groups]);

  const groupColumnHeaders = useCallback(
    (columns: ColumnDefinitionExtended<DataType>[]) => {
      if (!gridTools.isColumnGroupingEnabled) return;
      const groupedColumns: Array<{ title: string | undefined; keys: string[]; width: number }> = [];

      for (let index = 0; index < columns.length; index++) {
        const col = columns[index];

        const groupTitle = colKeysMappedToGroup![col.key];
        const previousItem = groupedColumns[groupedColumns.length - 1];
        if (previousItem && previousItem.title === groupTitle) {
          previousItem.keys.push(col.key);
          previousItem.width += col.width;
        } else
          groupedColumns.push({
            keys: [col.key],
            title: groupTitle,
            width: col.width,
          });
      }
      return groupedColumns;
    },
    [colKeysMappedToGroup, gridTools.isColumnGroupingEnabled]
  );

  const leftLockedGroupedColumnHeaders = useMemo<GroupedColumnHeaderDefinition[] | undefined>(
    () => pinnedColumnsToRender?.leftColumns && groupColumnHeaders(pinnedColumnsToRender?.leftColumns),
    [groupColumnHeaders, pinnedColumnsToRender?.leftColumns]
  );

  const rightLockedGroupedColumnHeaders = useMemo<GroupedColumnHeaderDefinition[] | undefined>(
    () => pinnedColumnsToRender?.rightColumns && groupColumnHeaders(pinnedColumnsToRender?.rightColumns),
    [groupColumnHeaders, pinnedColumnsToRender?.rightColumns]
  );

  const unlockedGroupedColumnHeaders = useMemo<GroupedColumnHeaderDefinition[] | undefined>(
    () => groupColumnHeaders(columnsToRender.columns),
    [columnsToRender.columns, groupColumnHeaders]
  );

  function getColumnByKey(key: string) {
    for (let index = 0; index < totalColumns.length; index++) {
      if (totalColumns[index].key === key) return totalColumns[index];
    }
  }

  gridTools.getColumnByKey = getColumnByKey;

  const dataGridProps = {
    icons,
    styling,
    localization,
    dimensions,
  };

  return {
    columnsToRender,
    groupedColumnHeaders: {
      unlockedGroupedColumnHeaders,
      leftLockedGroupedColumnHeaders,
      rightLockedGroupedColumnHeaders,
    },
    pinnedColumnsToRender,
    gridTools,
    dataTools,
    defaultStyling,
    dataGridProps,
    totalColumnsWidth,
    totalColumns,
    initializedColumns,
  };
}
