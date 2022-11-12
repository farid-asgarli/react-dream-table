import styles from "./Table.module.css";
import { concatStyles } from "../utils/ConcatStyles";
import { useRef } from "react";
import { ContextMenuOverlay } from "../components/ui/ContextMenu/ContextMenu";
import { FilterMenu } from "../components/ui/FilterMenu/FilterMenu";
import { PaginationTable } from "../components/ui/PaginationTable/PaginationTable";
import LoadingTable from "../components/ui/LoadingTable/LoadingTable";
import EmptyTable from "../components/ui/EmptyTable/EmptyTable";
import LoadingOverlay from "../components/ui/LoadingOverlay/LoadingOverlay";
import type { ContextLocalization, TableTypeDefinition } from "../types/Table";
import { TableLocalization } from "../localization/default";
import { DefaultTheme } from "../theme/default";
import { useTableTools } from "../hooks/tableTools";
import { useDetectOutsideClick } from "../hooks/detectOutsideClick";
import { useDetectKeyPress } from "../hooks/detectKeyPress";
import { TableStyleProps } from "../types/Utils";

function Table<DataType extends Record<string, any>>(
  tableProps: TableTypeDefinition<DataType>
) {
  const {
    isHoverable,
    isRowClickable,
    renderContextMenu,
    loading,
    onPaginationChange,
    serverSide,
    localization,
    tableHeight = "static",
    themeProperties = DefaultTheme,
    paginationDefaults,
    className,
    style,
    elementStylings,
  } = tableProps;

  const localizationRef = useRef<ContextLocalization>(TableLocalization);
  localizationRef.current = localization
    ? localization(TableLocalization)
    : TableLocalization;

  const contextMenuRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  const {
    handleDisplayContextMenu,
    handleDisplayFilterMenu,
    handleMapColGroups,
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
    updateInputValue,
    updateSelectedFilters,
    updatePaginationProps,
  } = useTableTools({
    styles,
    tableProps,
  });

  const contextMenuElement = renderContextMenu && contextMenu && (
    <ContextMenuOverlay
      ref={contextMenuRef}
      elements={renderContextMenu(
        contextMenu.data,
        selectedRows,
        paginationProps,
        selectedFilters
      )}
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

  const filterMenuElement = filterMenu?.key && (
    <FilterMenu
      key={filterMenu.key}
      columnKey={filterMenu.key}
      visible={filterMenu.visible === true}
      style={{
        left: filterMenu.position?.xAxis,
        top: filterMenu.position?.yAxis,
        ...elementStylings?.filterMenu?.style,
      }}
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
    />
  );

  const tableHeading = (
    <table
      className={concatStyles(
        styles.Table,
        styles.HeaderTable,
        isHoverable && styles.Hoverable,
        isRowClickable && styles.Clickable,
        elementStylings?.tableHead?.className
      )}
      style={{
        ...elementStylings?.tableHead?.style,
      }}
    >
      <colgroup>{handleMapColGroups}</colgroup>
      <thead>
        <tr>{handleMapTableHead}</tr>
      </thead>
    </table>
  );

  const dataTable = (
    <div
      className={concatStyles(styles.DataTable)}
      style={{
        height:
          tableHeight === "static" && paginationProps.pageSize
            ? paginationProps.pageSize * 45 + 42 * 2
            : "auto",
      }}
    >
      <LoadingOverlay
        visible={fetching.has("filter-select") || fetching.has("pagination")}
        localization={localizationRef.current}
      />
      <table
        className={concatStyles(
          styles.Table,
          isHoverable && styles.Hoverable,
          isRowClickable && styles.Clickable,
          elementStylings?.tableBody?.className
        )}
        style={{
          ...elementStylings?.tableBody?.style,
        }}
      >
        <colgroup>{handleMapColGroups}</colgroup>
        <tbody>{handleMapData}</tbody>
      </table>
    </div>
  );

  const defaultStyling: TableStyleProps = {
    cursor: fetching.size > 0 ? "wait" : undefined,
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

  return (
    <div style={defaultStyling} className={styles.Wrapper}>
      {contextMenuElement}
      {filterMenuElement}
      <div className={concatStyles(styles.Body, className)} style={style}>
        {tableHeading}
        {loading ? (
          <LoadingTable />
        ) : data && data.length > 0 ? (
          dataTable
        ) : (
          <EmptyTable localization={localizationRef.current} />
        )}
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
          />
        )}
      </div>
    </div>
  );
}

export default Table;
