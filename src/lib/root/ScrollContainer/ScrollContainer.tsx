import React from "react";
import { Animations } from "../../components/animations/Animations";
import "./ScrollContainer.scss";

export default function ScrollContainer(props: React.HtmlHTMLAttributes<HTMLDivElement>) {
  return (
    <Animations.Auto>
      <div className="scroll-container" {...props}></div>
    </Animations.Auto>
  );
}
