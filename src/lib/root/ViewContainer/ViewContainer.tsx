import React, { useCallback, useMemo } from "react";
import VirtualList from "../VirtualList/VirtualList";
import ActionsMenuButton from "../../components/ui/Buttons/ActionsMenuButton/ActionsMenuButton";
import ExpandButton from "../../components/ui/Buttons/ExpandButton/ExpandButton";
import Checkbox from "../../components/ui/Checkbox/Checkbox";
import { useDataGridContext } from "../../context/DataGridContext";
import { ColumnTypeExtended } from "../../types/Utils";
import { cs } from "../../utils/ConcatStyles";
import Cell from "../Cell/Cell";
import CellContent from "../CellContent/CellContent";
import LockedEndWrapper from "../LockedEndWrapper/LockedEndWrapper";
import LockedStartWrapper from "../LockedStartWrapper/LockedStartWrapper";
import Row from "../Row/Row";
import RowContainer from "../RowContainer/RowContainer";
import { ExpandProps, ViewContainerProps } from "../../types/Elements";
import "./ViewContainer.css";

function ViewContainer<DataType>(
  {
    tp,
    dataTools,
    tableTools,
    containerHeight,
    topScrollPosition,
    columnsInUse,
    pinnedColumns,
    totalColumnsWidth,
    containerWidth,
    displayActionsMenu,
    ...props
  }: ViewContainerProps<DataType>,
  viewRef: React.ForwardedRef<HTMLDivElement>
) {
  const { dimensions, localization } = useDataGridContext();

  function extractBasicCellProps(col: ColumnTypeExtended<DataType>, dat: DataType) {
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
      tableTools.updateActiveRow((data as any)[tp.uniqueRowKey]);
      displayActionsMenu({
        data: data as any,
        position: {
          xAxis: e.clientX,
          yAxis: e.clientY,
        },
        identifier: data[tp.uniqueRowKey as keyof DataType] as string,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [displayActionsMenu]
  );

  function renderCell(
    { width, data, dataRender, type, colKey, dataCellAlignment }: ReturnType<typeof extractBasicCellProps>,
    index: number
  ) {
    const commonTableRowCellProps = {
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
        const dataToRender = data[colKey as keyof DataType];
        children = dataRender ? dataRender?.(data) : (dataToRender as React.ReactNode);
        break;
      case "actions":
        children = <ActionsMenuButton onClick={rowActionsMenu(data)} />;
        break;
      case "expand":
        const uniqueIdData = data[tp.uniqueRowKey as keyof DataType];
        const isExpanded = tableTools.expandedRowKeys.has(uniqueIdData as string);
        children = (!tp.expandableRows?.excludeWhen || !tp.expandableRows.excludeWhen(data)) && (
          <ExpandButton
            isExpanded={isExpanded}
            onClick={(e) => {
              e.stopPropagation();
              tableTools.updateRowExpansion(uniqueIdData as string);
            }}
            title={isExpanded ? localization?.rowShrinkTitle : localization?.rowExpandTitle}
          />
        );

        break;
      case "select":
        children = (
          <Checkbox
            onChange={
              tp.selectableRows?.active && tp.selectableRows.type === "default"
                ? (e) => tableTools.updateSelectedRows(data[tp.uniqueRowKey as keyof unknown])
                : undefined
            }
            readOnly={tp.selectableRows?.type === "onRowClick"}
            checked={tableTools.selectedRows.has(data[tp.uniqueRowKey as keyof unknown])}
          />
        );
        break;
    }

    return (
      <Cell
        className={cs(type !== "data" && "tools", dataCellAlignment && `align-${dataCellAlignment}`)}
        {...commonTableRowCellProps}
      >
        <CellContent tooltipProps={tp.tooltipOptions}>{children}</CellContent>
      </Cell>
    );
  }

  const mapCommonRowProps = useCallback(
    (dat: DataType) => {
      const identifier: any = dat[tp.uniqueRowKey as keyof unknown];
      const isExpanded = tableTools.isRowExpanded(dat[tp.uniqueRowKey as keyof unknown]);
      return {
        onClick: (e: React.MouseEvent<HTMLDivElement>) => tableTools.onRowClick(e, dat),
        key: identifier,
        onContextMenu:
          tp.rowActionsMenu?.active && tp.rowActionsMenu?.displayOnRightClick !== false
            ? rowActionsMenu(dat)
            : undefined,
        expandRowProps: {
          children: tp.expandableRows?.render?.(dat, containerWidth),
          showSeperatorLine: tp.expandableRows?.showSeperatorLine === true,
          isRowExpanded: isExpanded,
          leftOffset: pinnedColumns?.leftWidth,
          basicColumnsWidth: columnsInUse.totalWidth,
        } as ExpandProps,
        isRowSelected: tableTools.isRowSelected(identifier),
        isRowActive: tableTools.isRowActive(identifier),
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      tp.uniqueRowKey,
      tp.expandableRows,
      tableTools.expandedRowKeys,
      tableTools.selectedRows,
      tableTools.activeRow,
      pinnedColumns?.leftWidth,
      containerWidth,
    ]
  );

  const indexedData = useMemo(() => {
    return dataTools.data?.map((d, i) => ({ ...d, __row_index: i }));
  }, [dataTools.data]);

  return (
    <div ref={viewRef} className="view-container" {...props}>
      <RowContainer>
        {dataTools.data && (
          <VirtualList
            containerHeight={containerHeight!}
            rowHeight={
              dimensions.defaultDataRowHeight +
              // To address bordered-cell (border-bottom, see Scroller and theming.css).
              1
            }
            expandPanelHeight={dimensions.defaultExpandPanelHeight}
            topScrollPosition={topScrollPosition}
            disabled={tp.virtualization?.active === false}
            preRenderedRowCount={tp.virtualization?.preRenderedRowCount}
            expandRowKeys={tableTools.expandedRowKeys as Set<number>}
            elements={indexedData!}
            uniqueRowKey={tp.uniqueRowKey as keyof DataType}
            renderElement={(d, style) => (
              <Row
                className={d.__row_index % 2 === 0 ? "odd" : undefined}
                style={style}
                totalColumnsWidth={totalColumnsWidth}
                tabIndex={d.__row_index + 1}
                {...mapCommonRowProps(d)}
              >
                {pinnedColumns?.leftColumns && (
                  <LockedStartWrapper type="body">
                    {pinnedColumns.leftColumns.map((col, i) => renderCell(extractBasicCellProps(col, d), i))}
                  </LockedStartWrapper>
                )}
                {columnsInUse.columns.map((col, i) => renderCell(extractBasicCellProps(col, d), i))}
                {pinnedColumns?.rightColumns && (
                  <LockedEndWrapper type="body">
                    {pinnedColumns.rightColumns.map((col, i) => renderCell(extractBasicCellProps(col, d), i))}
                  </LockedEndWrapper>
                )}
              </Row>
            )}
          />
        )}
      </RowContainer>
    </div>
  );
}

export default React.forwardRef(ViewContainer);
