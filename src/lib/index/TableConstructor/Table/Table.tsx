import { TableBody } from "../TableBody/TableBody";
import { TableHead } from "../TableHead/TableHead";
import { TableProps } from "../../../types/Table";
import { DefaultTableTheme } from "../../../theme/default";
import { DefaultTableLocalization } from "../../../localization/default";
import { useImperativeHandle, useMemo, useRef } from "react";
import { useTableTools } from "../../../hooks/tableTools";
import { ContextMenuOverlay } from "../../../components/ui/ContextMenu/ContextMenu";
import { FilterMenu } from "../../../components/ui/FilterMenu/FilterMenu";
import { useDetectOutsideClick } from "../../../hooks/detectOutsideClick";
import { useDetectKeyPress } from "../../../hooks/detectKeyPress";
import { TableStyleProps } from "../../../types/Utils";
import { PaginationContainer } from "../../../components/ui/PaginationContainer/PaginationContainer";
import { concatStyles } from "../../../utils/ConcatStyles";
import { DefaultTableDimensions } from "../../../static/dimensions";
import LoadingSkeleton from "../../../components/ui/LoadingSkeleton/LoadingSkeleton";
import EmptyTable from "../../../components/ui/EmptyTable/EmptyTable";
import { TableContext } from "../../../context/TableContext";
import LoadingOverlay from "../../../components/ui/LoadingOverlay/LoadingOverlay";
import "./Table.css";

export function Table<DataType extends Record<string, any>>(tableProps: TableProps<DataType>) {
  const {
    contextMenu: contextMenuProps,
    changeColumnVisibility,
    filterDisplayStrategy,
    tableHeight = "100%",
    draggableColumns,
    elementStylings,
    expandableRows,
    selectionMode,
    isHoverable,
    serverSide,
    pagination,
    className,
    tableRef,
    loading,
    columns,
    style,
  } = tableProps;

  const tableDimensions = useMemo(
    () => ({
      ...DefaultTableDimensions,
      defaultHeadRowHeight: filterDisplayStrategy === "alternative" ? 72 : DefaultTableDimensions.defaultHeadRowHeight,
      ...tableProps.tableDimensions,
    }),
    [filterDisplayStrategy, tableProps.tableDimensions]
  );
  const tableLocalization = useMemo(
    () => ({ ...DefaultTableLocalization, ...tableProps.localization }),
    [tableProps.localization]
  );
  const tableTheme = useMemo(
    () => ({ ...DefaultTableTheme, ...tableProps.themeProperties }),
    [tableProps.themeProperties]
  );

  const contextMenuRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableHeadRef = useRef<HTMLDivElement>(null);

  const {
    handleDisplayContextMenu,
    handleDisplayFilterMenu,
    handleHeaderVisibility,
    updatePaginationProps,
    updateSelectedFilters,
    updateInputValue,
    setColumnOrder,
    handleMapTableHead,
    columnDimensions,
    paginationProps,
    selectedFilters,
    columnsToRender,
    prefetchedFilters,
    visibleHeaders,
    handleMapData,
    selectedRows,
    contextMenu,
    filterMenu,
    inputValue,
    progressReporters,
    data,
    dataWithoutPagination,
  } = useTableTools<DataType>({
    ...tableProps,
    localization: tableLocalization,
    tableDimensions: tableDimensions,
  });

  const contextMenuElement = contextMenuProps?.render && contextMenu && (
    <ContextMenuOverlay
      ref={contextMenuRef}
      elements={contextMenuProps.render(contextMenu.data, selectedRows, paginationProps, selectedFilters, () =>
        handleDisplayContextMenu(undefined, "hidden")
      )}
      style={{
        left: contextMenu.position?.xAxis,
        top: contextMenu.position?.yAxis,
      }}
      visible={contextMenu.visible === true}
      onHide={(visible) => {
        !visible && handleDisplayContextMenu(undefined, "destroy-on-close");
      }}
    />
  );

  const filterMenuElement = () => {
    if (filterMenu?.key) {
      const currentColumn = columns.find((x) => x.key === filterMenu?.key);
      return (
        <FilterMenu
          key={filterMenu.key}
          columnKey={filterMenu.key}
          visible={filterMenu.visible === true}
          fetchedFilter={prefetchedFilters}
          updateSelectedFilters={updateSelectedFilters}
          updateInputValue={updateInputValue}
          value={inputValue[filterMenu.key]}
          ref={filterMenuRef}
          selectedFilters={selectedFilters[filterMenu.key]}
          isServerSide={!!serverSide?.defaultFiltering?.onFilterSearchAsync}
          loading={progressReporters.has("filter-fetch")}
          currentColumn={currentColumn}
          style={{
            left: filterMenu.position?.xAxis,
            top: filterMenu.position?.yAxis,
          }}
        />
      );
    }
  };

  useDetectOutsideClick(
    [
      { key: "context", ref: contextMenuRef },
      { key: "filter", ref: filterMenuRef },
    ],
    (_, key) => {
      switch (key) {
        case "context":
          handleDisplayContextMenu(undefined, "hidden");
          break;
        case "filter":
          handleDisplayFilterMenu(undefined, "hidden");
          break;
      }
    }
  );

  useDetectKeyPress((key) => {
    if (key === "Escape") {
      handleDisplayFilterMenu(undefined, "hidden");
      handleDisplayContextMenu(undefined, "hidden");
    }
  });

  useImperativeHandle(
    tableRef,
    () => ({
      getCurrentData: () => dataWithoutPagination,
      getCurrentColumns: () => columnsToRender,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnsToRender, data]
  );

  const totalTableWidth = useMemo(() => {
    const selectionColumnWidth = selectionMode ? tableDimensions.selectionMenuColumnWidth : 0;
    const expansionColumnWidth = expandableRows ? tableDimensions.expandedMenuColumnWidth : 0;
    const contextMenuColumnWidth = contextMenuProps?.render ? tableDimensions.contextMenuColumnWidth : 0;

    let totalDataColumnsWidth = 0;

    columnDimensions.forEach((val, key) => {
      if (visibleHeaders.has(key)) totalDataColumnsWidth += val;
    });

    return (
      totalDataColumnsWidth +
      selectionColumnWidth +
      expansionColumnWidth +
      contextMenuColumnWidth +
      /**scrollbar width */
      20 +
      /**scrollbar border */
      6 * 2 +
      /**padding */
      18
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnDimensions, expandableRows, contextMenuProps?.render, selectionMode, visibleHeaders]);

  const dataTable = (
    <div ref={tableContainerRef} className="table-container">
      <LoadingOverlay
        style={{
          height:
            tableContainerRef.current && tableHeadRef.current
              ? tableContainerRef.current.clientHeight + 20 - tableHeadRef.current.clientHeight
              : "100%",
          top: (tableHeadRef.current?.clientHeight ?? 0) + 10,
        }}
        visible={
          progressReporters.has("filter-select") || progressReporters.has("pagination") || progressReporters.has("sort")
        }
      />
      <TableHead
        onColumnDragged={
          typeof tableProps.draggableColumns !== "boolean" ? tableProps.draggableColumns?.onColumnDragged : undefined
        }
        draggingEnabled={!!draggableColumns}
        setColumnOrder={setColumnOrder}
        items={handleMapTableHead}
        ref={tableHeadRef}
      />
      {loading ? (
        <LoadingSkeleton rowCount={paginationProps.pageSize} overrideTotalHeight />
      ) : data && data.length > 0 ? (
        <TableBody
          style={{
            width: totalTableWidth,
          }}
        >
          {handleMapData}
        </TableBody>
      ) : (
        <EmptyTable />
      )}
    </div>
  );

  const defaultStyling: TableStyleProps = {
    "--color-background": tableTheme.backgroundColor,
    "--color-primary": tableTheme.primaryColor,
    "--border-radius-lg": tableTheme.borderRadiusLg,
    "--border-radius-md": tableTheme.borderRadiusMd,
    "--border-radius-sm": tableTheme.borderRadiusSm,
  };

  return (
    <TableContext.Provider
      value={{
        localization: tableLocalization,
        tableDimensions: tableDimensions,
        themeProperties: tableTheme,
        tableHeight: tableHeight,
        settingsMenuColumns:
          typeof changeColumnVisibility !== "boolean" && changeColumnVisibility?.defaultValues
            ? changeColumnVisibility.defaultValues
            : columns,
        filterDisplayStrategy: filterDisplayStrategy ?? "default",
        elementStylings,
        paginationDefaults: pagination?.defaults,
      }}
    >
      <div style={{ ...defaultStyling, ...style }} className={concatStyles(className, "table-wrapper")}>
        {contextMenuElement}
        {filterMenuElement()}
        <div
          className={concatStyles(
            "table-main",
            isHoverable && "hoverable",
            selectionMode === "onRowClick" && "clickable",
            elementStylings?.tableBody?.className
          )}
        >
          {dataTable}
          {data && (
            <PaginationContainer
              changeColumnVisibility={changeColumnVisibility}
              paginationProps={paginationProps}
              updatePaginationProps={updatePaginationProps}
              onPaginationChange={pagination?.onPaginationChange}
              progressReporters={progressReporters}
              settingsMenuProps={{
                handleHeaderVisibility,
                visibleColumnKeys: visibleHeaders,
              }}
              selectedRows={selectedRows}
              loading={loading}
            />
          )}
        </div>
      </div>
    </TableContext.Provider>
  );
}
