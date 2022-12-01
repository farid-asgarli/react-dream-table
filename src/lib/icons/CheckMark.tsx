import React from "react";

export default function CheckMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" {...props}>
      <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
    </svg>
  );
}
