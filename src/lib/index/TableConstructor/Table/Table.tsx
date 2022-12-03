import { TableBody } from "../TableBody/TableBody";
import { TableHead } from "../TableHead/TableHead";
import { ContextLocalization, TableProps } from "../../../types/Table";
import { DefaultTheme } from "../../../theme/default";
import { TableLocalization } from "../../../localization/default";
import { useMemo, useRef } from "react";
import { useTableTools } from "../../../hooks/tableTools";
import { ContextMenuOverlay } from "../../../components/ui/ContextMenu/ContextMenu";
import { FilterMenu } from "../../../components/ui/FilterMenu/FilterMenu";
import { useDetectOutsideClick } from "../../../hooks/detectOutsideClick";
import { useDetectKeyPress } from "../../../hooks/detectKeyPress";
import { TableStyleProps } from "../../../types/Utils";
import LoadingTable from "../../../components/ui/LoadingTable/LoadingTable";
import EmptyTable from "../../../components/ui/EmptyTable/EmptyTable";
import { PaginationTable } from "../../../components/ui/PaginationTable/PaginationTable";
import { concatStyles } from "../../../utils/ConcatStyles";
import { TableMeasures } from "../../../static/measures";
import "./Table.css";

export function Table<DataType extends Record<string, any>>(tableProps: TableProps<DataType>) {
  const {
    isHoverable,
    renderContextMenu,
    loading,
    onPaginationChange,
    serverSide,
    localization,
    tableHeight,
    themeProperties = DefaultTheme,
    paginationDefaults,
    className,
    style,
    elementStylings,
    columns,
    draggableColumns,
  } = tableProps;

  const localizationRef = useRef<ContextLocalization>(TableLocalization);
  localizationRef.current = localization ? localization(TableLocalization) : TableLocalization;

  const contextMenuRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  const {
    handleHeaderVisibility,
    handleDisplayContextMenu,
    handleDisplayFilterMenu,
    handleMapData,
    handleMapTableHead,
    contextMenu,
    filterMenu,
    paginationProps,
    selectedFilters,
    selectedRows,
    fetchedFilters,
    fetching,
    inputValue,
    data,
    visibleHeaders,
    columnMeasures,
    updateInputValue,
    updateSelectedFilters,
    updatePaginationProps,
    setColumnOrder,
  } = useTableTools({
    tableProps,
  });

  const contextMenuElement = renderContextMenu && contextMenu && (
    <ContextMenuOverlay
      ref={contextMenuRef}
      elements={renderContextMenu(contextMenu.data, selectedRows, paginationProps, selectedFilters)}
      style={{
        left: contextMenu.position?.xAxis,
        top: contextMenu.position?.yAxis,
        ...elementStylings?.contextMenu?.style,
      }}
      className={elementStylings?.contextMenu?.className}
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
          fetchedFilter={fetchedFilters}
          updateSelectedFilters={updateSelectedFilters}
          updateInputValue={updateInputValue}
          value={inputValue?.[filterMenu.key]}
          ref={filterMenuRef}
          selectedFilters={selectedFilters[filterMenu.key]}
          isServerSide={!!serverSide?.filters?.onFilterSearch}
          loading={fetching.has("filter-fetch")}
          localization={localizationRef.current}
          className={elementStylings?.filterMenu?.className}
          currentColumn={currentColumn}
          style={{
            left: filterMenu.position?.xAxis,
            top: filterMenu.position?.yAxis,
            ...elementStylings?.filterMenu?.style,
          }}
        />
      );
    }
  };

  const defaultStyling: TableStyleProps = {
    "--color-background": themeProperties.backgroundColor,
    "--color-primary": themeProperties.primaryColor,
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

  const calculateTableWidth = useMemo(() => {
    const tableHasSelectionWidth = tableProps.selectionMode === "multiple" ? TableMeasures.selectionMenuColumnWidth : 0;

    return (
      Array.from(columnMeasures).reduce((partialSum, a) => {
        const key = a[0];
        const value = a[1];
        if (!visibleHeaders.has(key)) return partialSum;
        return partialSum + value;
      }, 0) +
      tableHasSelectionWidth +
      TableMeasures.contextMenuColumnWidth +
      /**scrollbar width */
      20 +
      /**scrollbar border */
      6 * 2 +
      /**padding */
      18
    );
  }, [columnMeasures, tableProps.selectionMode, visibleHeaders]);

  const dataTable = (
    <div className="table-container">
      <TableHead draggingEnabled={!!draggableColumns} setColumnOrder={setColumnOrder} items={handleMapTableHead} />
      {loading ? (
        <LoadingTable />
      ) : data && data.length > 0 ? (
        <TableBody
          loadingVisible={fetching.has("filter-select") || fetching.has("pagination")}
          localization={localizationRef.current}
          style={{
            height: tableHeight,
            width: calculateTableWidth,
          }}
        >
          {handleMapData}
        </TableBody>
      ) : (
        <EmptyTable localization={localizationRef.current} />
      )}
    </div>
  );

  return (
    <div style={{ ...defaultStyling, ...style }} className={concatStyles(className, "table-wrapper")}>
      {contextMenuElement}
      {filterMenuElement()}
      <div
        className={concatStyles(
          "table-main clickable",
          isHoverable && "hoverable",
          elementStylings?.tableBody?.className
        )}
      >
        {dataTable}
        {data && (
          <PaginationTable
            paginationProps={paginationProps}
            updatePaginationProps={updatePaginationProps}
            onPaginationChange={onPaginationChange}
            fetching={fetching}
            localization={localizationRef.current}
            paginationDefaults={paginationDefaults}
            className={elementStylings?.tableFoot?.className}
            style={elementStylings?.tableFoot?.style}
            settingsMenuProps={{
              columns: columns,
              handleHeaderVisibility,
              visibleColumnKeys: visibleHeaders,
            }}
          />
        )}
      </div>
    </div>
  );
}
