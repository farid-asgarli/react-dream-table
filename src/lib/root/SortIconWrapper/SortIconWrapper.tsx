import React from "react";
import SortButton from "../../components/ui/Buttons/SortButton/SortButton";
import "./SortIconWrapper.scss";

export default function SortIconWrapper(props: React.HtmlHTMLAttributes<HTMLDivElement>) {
  return (
    <div className="sort-icon-wrapper" {...props}>
      <SortButton sortingDirection="ascending" />
    </div>
  );
}
