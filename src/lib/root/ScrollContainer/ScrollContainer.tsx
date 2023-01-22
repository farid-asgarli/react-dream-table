import React from "react";
import Fade from "../../components/animations/Fade/Fade";
import "./ScrollContainer.css";

export default function ScrollContainer(props: React.HtmlHTMLAttributes<HTMLDivElement>) {
  return (
    <Fade>
      <div className="scroll-container" {...props}></div>
    </Fade>
  );
}
