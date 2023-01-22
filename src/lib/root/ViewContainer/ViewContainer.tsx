import React, { useCallback, useMemo } from "react";
import VirtualList from "../VirtualList/VirtualList";
import ContextMenuButton from "../../components/ui/Buttons/ContextMenuButton/ContextMenuButton";
import ExpandButton from "../../components/ui/Buttons/ExpandButton/ExpandButton";
import Checkbox from "../../components/ui/Checkbox/Checkbox";
import { useTableContext } from "../../context/TableContext";
import { ColumnTypeExtended } from "../../types/Utils";
import { cs } from "../../utils/ConcatStyles";
import Cell from "../Cell/Cell";
import CellContent from "../CellContent/CellContent";
import LockedEndWrapper from "../LockedEndWrapper/LockedEndWrapper";
import LockedStartWrapper from "../LockedStartWrapper/LockedStartWrapper";
import Row from "../Row/Row";
import RowContainer from "../RowContainer/RowContainer";
import "./ViewContainer.css";
import { ViewContainerProps } from "../../types/Elements";

function ViewContainer<DataType>({
  tp,
  tools,
  containerHeight,
  scrollPosition,
  columnsInUse,
  pinnedColumns,
  totalColumnsWidth,
  ...props
}: ViewContainerProps<DataType>) {
  const { dimensions, localization } = useTableContext();

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

  const rowContextMenu = useCallback(
    (data: DataType) => (e: React.MouseEvent) => {
      e.preventDefault();
      tools.displayContextMenu(
        {
          data: data,
          position: {
            xAxis: e.clientX,
            yAxis: e.clientY,
          },
        },
        true
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tools.displayContextMenu]
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
      case "context":
        children = <ContextMenuButton onClick={rowContextMenu(data)} />;
        break;
      case "expand":
        const uniqueIdData = data[tp.uniqueRowKey as keyof DataType];
        const isExpanded = tools.expandedRowKeys.has(uniqueIdData as string);
        children = (!tp.expandableRows?.excludeWhen || !tp.expandableRows.excludeWhen(data)) && (
          <ExpandButton
            isExpanded={isExpanded}
            onClick={(e) => {
              e.stopPropagation();
              tools.handleExpandRow(uniqueIdData as string);
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
                ? (e) => tools.handleUpdateSelection(data[tp.uniqueRowKey as keyof unknown])
                : undefined
            }
            readOnly={tp.selectableRows?.type === "onRowClick"}
            checked={tools.selectedRows.has(data[tp.uniqueRowKey as keyof unknown])}
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
      const isExpanded = tools.expandedRowKeys.has(dat[tp.uniqueRowKey as keyof unknown]);
      return {
        onClick: (e: React.MouseEvent<HTMLDivElement>) => tools.handleRowClick(e, dat),
        key: identifier,
        onContextMenu: tp.contextMenu?.displayOnRightClick === false ? undefined : rowContextMenu(dat),
        expandRowProps: {
          children: tp.expandableRows?.render?.(dat),
          showSeperatorLine: tp.expandableRows?.showSeperatorLine === true,
          isRowExpanded: isExpanded,
          leftOffset: pinnedColumns?.leftWidth,
          basicColumnsWidth: columnsInUse.totalWidth,
        },
        isSelected: tools.selectedRows.has(identifier),
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tp.uniqueRowKey, tp.expandableRows, tools.expandedRowKeys, tools.selectedRows, pinnedColumns?.leftWidth]
  );

  const dataIndexer = useMemo(
    () => tools.dataTools.data?.map((d, i) => ({ ...d, _row_index: i })),
    [tools.dataTools.data]
  );

  return (
    <div className="view-container" {...props}>
      <RowContainer>
        {tools.dataTools.data && (
          <VirtualList
            containerHeight={containerHeight!}
            rowHeight={dimensions.defaultDataRowHeight}
            expandPanelHeight={dimensions.defaultExpandPanelHeight}
            scrollPosition={scrollPosition}
            disabled={tp.virtualization?.active === false}
            preRenderedRowCount={tp.virtualization?.preRenderedRowCount}
            expandRowKeys={tools.expandedRowKeys as Set<number>}
            elements={dataIndexer!}
            uniqueRowKey={tp.uniqueRowKey as keyof DataType}
            renderElement={(d, style) => (
              <Row
                className={d._row_index % 2 === 0 ? "odd" : undefined}
                style={style}
                totalColumnsWidth={totalColumnsWidth}
                tabIndex={d._row_index + 1}
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

export default ViewContainer;
