import DataGridStaticContext from "../../context/DataGridStaticContext";
import DataGridFactory from "../DataGridFactory/DataGridFactory";
import { DataGridProps, DataGridReference } from "../../types/DataGrid";
import { useGridFactory } from "../../logic/tools/grid-factory";
import { useMenuFactory } from "../../logic/tools/menu-factory";
import { useEffect, useImperativeHandle } from "react";
import { GridDataType } from "../../types/Utils";
import { ConstProps } from "../../static/constantProps";
import { createPortal } from "react-dom";
import React from "react";
import "../../styles/theming.scss";

function DataGrid<DataType extends GridDataType>(gridProps: DataGridProps<DataType>) {
  const {
    columnsToRender,
    dataGridProps,
    dataTools,
    defaultStyling,
    pinnedColumnsToRender,
    gridTools,
    totalColumnsWidth,
    totalColumns,
    initializedColumns,
    groupedColumnHeaders,
  } = useGridFactory(gridProps);

  const {
    dataActionsMenu,
    displayDataActionsMenu,
    displayFilterFnsMenu,
    displayHeaderActionsMenu,
    filterFnsMenu,
    filterFnsMenuProps,
    headerActionsMenu,
    settingsMenu,
  } = useMenuFactory({
    ...dataGridProps,
    gridProps,
    dataTools,
    gridTools,
  });

  useImperativeHandle(
    gridProps.dataGridApiRef,
    (): DataGridReference<DataType> => ({
      getCurrentData: () => dataTools.dataWithoutPagination,
      getCurrentColumns: () => totalColumns,
      getCurrentFilters: () => dataTools.currentFilters,
      getCurrentPagination: () => dataTools.currentPagination,
      resetCurrentFilters: dataTools.resetCurrentFilters,
      getSelectedRows: () => gridTools.selectedRows,
    }),
    [
      dataTools.currentFilters,
      dataTools.currentPagination,
      dataTools.dataWithoutPagination,
      dataTools.resetCurrentFilters,
      gridTools.selectedRows,
      totalColumns,
    ]
  );

  function renderContextOverlay() {
    const contextOverlayElements = (
      <React.Fragment>
        {gridProps.rowActionsMenu?.enabled && dataActionsMenu}
        {gridProps.headerActionsMenu?.enabled !== false && headerActionsMenu}
        {gridProps.settingsMenu?.enabled !== false && settingsMenu.optionsMenu}
        {filterFnsMenu}
      </React.Fragment>
    );
    if (gridProps.contextMenuRenderRoot)
      return createPortal(
        <div className="data-grid" data-theme={gridTools.isDarkModeEnabled ? "dark" : "light"} style={defaultStyling}>
          {contextOverlayElements}
        </div>,
        gridProps.contextMenuRenderRoot
      );
    return contextOverlayElements;
  }

  useEffect(() => {
    if (gridTools.expandedRowKeys.size > 0) gridTools.closeExpandedRows();
    gridTools.clearExpandRowHeightCache();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTools.data]);

  return (
    <DataGridStaticContext.Provider
      value={{
        ...dataGridProps,
        columnVisibilityProps: gridProps.columnVisibilityOptions?.defaultValues ?? gridProps.columns,
        striped: gridProps.striped !== false,
        animationProps: {
          duration: 300,
        },
        isRowClickable: !!gridProps.onRowClick,
        virtualizationEnabled: gridTools.isVirtualizationIsEnabled,
        groupingHeaderEnabled: gridTools.isColumnGroupingEnabled,
        defaultLocale: gridProps.localization?.defaultLocale ?? ConstProps.defaultLocale,
      }}
    >
      <DataGridFactory
        theme={gridProps.theme ?? "light"}
        columnsToRender={columnsToRender}
        groupedColumnHeaders={groupedColumnHeaders}
        pinnedColumns={pinnedColumnsToRender}
        totalColumnsWidth={totalColumnsWidth}
        gridProps={gridProps}
        style={defaultStyling}
        initializedColumns={initializedColumns}
        dataTools={dataTools}
        gridTools={gridTools}
        displayDataActionsMenu={displayDataActionsMenu}
        displayHeaderActionsMenu={displayHeaderActionsMenu}
        filterFnsMenu={{
          displayFilterFnsMenu,
          activeFilterMenuKey: filterFnsMenuProps.identifier,
        }}
        optionsMenu={{
          displayOptionsMenu: settingsMenu.displayOptionsMenu,
          isVisible: settingsMenu.optionsMenuProps.visible,
        }}
      >
        {renderContextOverlay()}
      </DataGridFactory>
    </DataGridStaticContext.Provider>
  );
}
export default DataGrid;
