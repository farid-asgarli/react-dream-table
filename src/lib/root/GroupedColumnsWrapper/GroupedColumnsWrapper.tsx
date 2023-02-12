import { useDataGridStaticContext } from "../../context/DataGridStaticContext";
import { GroupedColumnHeaderDefinition } from "../../types/Utils";
import { cs } from "../../utils/ConcatStyles";
import "./GroupedColumnsWrapper.scss";

interface GroupedColumnsWrapperProps {
  groupedColumnHeaders: GroupedColumnHeaderDefinition[] | undefined;
  children: React.ReactNode;
}

export default function GroupedColumnsWrapper({ groupedColumnHeaders, children }: GroupedColumnsWrapperProps) {
  const { dimensions } = useDataGridStaticContext();
  return groupedColumnHeaders ? (
    <div className="grouped-columns-wrapper">
      <div className="grouped-headers">
        {groupedColumnHeaders.map((groupColHeader, index) => (
          <div
            style={{
              width: groupColHeader.width,
              height: dimensions.defaultGroupedColumnHeight,
            }}
            className={cs("grouped-column-header", groupColHeader.title && "existing")}
            key={index}
          >
            <div className="grouped-column-header-content">{groupColHeader.title}</div>
          </div>
        ))}
      </div>
      <div className="grouped-columns-row">{children}</div>
    </div>
  ) : (
    (children as JSX.Element)
  );
}
