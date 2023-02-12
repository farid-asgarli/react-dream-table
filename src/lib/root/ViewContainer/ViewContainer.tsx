import React, { useCallback } from "react";
import VirtualList from "../VirtualList/VirtualList";
import ActionsMenuButton from "../../components/ui/Buttons/ActionsMenuButton/ActionsMenuButton";
import ExpandButton from "../../components/ui/Buttons/ExpandButton/ExpandButton";
import Checkbox from "../../components/ui/Checkbox/Checkbox";
import { useDataGridStaticContext } from "../../context/DataGridStaticContext";
import { ColumnDefinitionExtended, GridDataType } from "../../types/Utils";
import { cs } from "../../utils/ConcatStyles";
import Cell from "../Cell/Cell";
import CellContent from "../CellContent/CellContent";
import LockedEndWrapper from "../LockedEndWrapper/LockedEndWrapper";
import LockedStartWrapper from "../LockedStartWrapper/LockedStartWrapper";
import Row from "../Row/Row";
import RowContainer from "../RowContainer/RowContainer";
import { RowProps, ViewContainerProps } from "../../types/Elements";
import "./ViewContainer.scss";

const ViewContainer = <DataType extends GridDataType>({
  gridProps,
  dataTools,
  gridTools,
  containerHeight,
  topScrollPosition,
  columnsToRender,
  pinnedColumns,
  totalColumnsWidth,
  containerWidth,
  displayActionsMenu,
  getRowExpansionHeight,
  viewRef,
  indexedData,
  ...props
}: ViewContainerProps<DataType>) => {
  const { dimensions, localization } = useDataGridStaticContext();

  function extractBasicCellProps(col: ColumnDefinitionExtended<DataType>, dat: DataType) {
    return {
      colKey: col.key,
      data: dat,
      width: col.width,
      type: col.type,
      dataRender: col.dataRender,
      headCellAlignment: col.headerAlignment,
      dataCellAlignment: col.cellAlignment,
    };
  }

  const rowActionsMenu = useCallback(
    (data: DataType) => (e: React.MouseEvent) => {
      e.preventDefault();
      gridTools.updateActiveRow(data[gridProps.uniqueRowKey]);
      displayActionsMenu({
        data: data,
        position: {
          xAxis: e.clientX,
          yAxis: e.clientY + 10,
        },
        identifier: data[gridProps.uniqueRowKey],
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [displayActionsMenu]
  );

  function renderCell(
    { width, data, dataRender, type, colKey, dataCellAlignment }: ReturnType<typeof extractBasicCellProps>,
    index: number,
    rowIndex: number
  ) {
    const commonDataGridRowCellProps = {
      style: {
        minWidth: width,
        maxWidth: width,
        minHeight: dimensions.defaultDataRowHeight,
        maxHeight: dimensions.defaultDataRowHeight,
      },
      key: index,
    };

    let children: React.ReactNode;

    switch (type) {
      case "data":
        const dataToRender = data[colKey];
        children = dataRender ? dataRender?.(data) : dataToRender;
        break;
      case "actions":
        children = <ActionsMenuButton onClick={rowActionsMenu(data)} />;
        break;
      case "expand":
        const isExpanded = gridTools.expandedRowKeys.has(rowIndex);
        children = (!gridProps.expandableRows?.excludeWhen || !gridProps.expandableRows.excludeWhen(data)) && (
          <ExpandButton
            isExpanded={isExpanded}
            onClick={(e) => {
              e.stopPropagation();
              gridTools.updateRowExpansion(rowIndex);
            }}
            title={isExpanded ? localization?.rowShrinkTitle : localization?.rowExpandTitle}
          />
        );

        break;
      case "select":
        children = (
          <Checkbox
            onChange={
              gridProps.rowSelection?.enabled && gridProps.rowSelection.type === "default"
                ? (e) => gridTools.updateSelectedRows(data[gridProps.uniqueRowKey])
                : undefined
            }
            readOnly={gridProps.rowSelection?.type === "onRowClick"}
            checked={gridTools.selectedRows.has(data[gridProps.uniqueRowKey])}
          />
        );
        break;
    }

    return (
      <Cell
        className={cs(type !== "data" && "tools", dataCellAlignment && `align-${dataCellAlignment}`, index === 0 && "no-border")}
        {...commonDataGridRowCellProps}
      >
        <CellContent tooltipProps={gridProps.tooltipOptions}>{children}</CellContent>
      </Cell>
    );
  }

  const mapCommonRowProps = useCallback(
    (dat: DataType, index: number): Partial<RowProps> & { key: string } => {
      const identifier: any = dat[gridProps.uniqueRowKey];
      const isExpanded = gridTools.isRowExpanded(index);
      return {
        onClick: (e: React.MouseEvent<HTMLDivElement>) => gridTools.onRowClick(e, dat),
        key: identifier,
        onContextMenu: gridTools.isRightClickIsActive ? rowActionsMenu(dat) : undefined,
        expandRowProps: {
          children: gridProps.expandableRows?.render?.(dat, containerWidth),
          showSeparatorLine: gridProps.expandableRows?.showSeparatorLine === true,
          isRowExpanded: isExpanded,
          leftOffset: pinnedColumns?.leftWidth,
          updateExpandRowHeightCache: gridTools.isDynamicRowExpandHeightEnabled ? gridTools.updateExpandRowHeightCache : undefined,
          rowIndex: index,
        },
        isRowSelected: gridTools.isRowSelected(identifier),
        isRowActive: gridTools.isRowActive(identifier),
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      gridTools.isRowExpanded,
      gridProps.uniqueRowKey,
      gridProps.expandableRows,
      gridTools.isRowSelected,
      gridTools.isRowActive,
      pinnedColumns?.leftWidth,
      containerWidth,
    ]
  );

  const renderCellCollection = (
    col: ColumnDefinitionExtended<DataType>,
    d: DataType,
    cellIndex: number,
    rowIndex: number = d.__virtual_row_index
  ) => renderCell(extractBasicCellProps(col, d), cellIndex, rowIndex);

  const renderFullRow = useCallback(
    (rowData: DataType, style: React.CSSProperties = {}, rowIndex = rowData.__virtual_row_index) => (
      <Row
        className={rowIndex % 2 === 0 ? undefined : "odd"}
        style={style}
        totalColumnsWidth={totalColumnsWidth}
        tabIndex={rowIndex + 1}
        {...mapCommonRowProps(rowData, rowIndex)}
      >
        {!!pinnedColumns?.leftWidth && (
          <LockedStartWrapper type="body">
            {pinnedColumns.leftColumns.map((col, cellIndex) => renderCellCollection(col, rowData, cellIndex, rowIndex))}
          </LockedStartWrapper>
        )}
        {columnsToRender.columns.map((col, cellIndex) => renderCellCollection(col, rowData, cellIndex, rowIndex))}
        {!!pinnedColumns?.rightWidth && (
          <LockedEndWrapper type="body">
            {pinnedColumns.rightColumns.map((col, cellIndex) => renderCellCollection(col, rowData, cellIndex, rowIndex))}
          </LockedEndWrapper>
        )}
      </Row>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      columnsToRender.columns,
      mapCommonRowProps,
      pinnedColumns?.leftWidth,
      pinnedColumns?.rightWidth,
      renderCellCollection,
      totalColumnsWidth,
    ]
  );
  return (
    <div ref={viewRef} className="view-container" {...props}>
      <RowContainer>
        {gridTools.isVirtualizationIsEnabled && indexedData && (
          <VirtualList
            containerHeight={containerHeight}
            rowHeight={dimensions.defaultDataRowHeight}
            expandPanelHeight={dimensions.defaultExpandPanelHeight}
            getRowExpansionHeight={getRowExpansionHeight}
            topScrollPosition={topScrollPosition}
            preRenderedRowCount={gridProps.virtualization?.preRenderedRowCount}
            expandRowKeys={gridTools.expandedRowKeys}
            rows={indexedData}
            isDynamicExpandActive={gridTools.isDynamicRowExpandHeightEnabled}
            getExpandRowHeightFromCache={gridTools.getExpandRowHeightFromCache}
            renderElement={renderFullRow}
          />
        )}
        {!gridTools.isVirtualizationIsEnabled && dataTools.data && dataTools.data.map((dat, index) => renderFullRow(dat, undefined, index))}
      </RowContainer>
    </div>
  );
};

export default ViewContainer;
