import React from "react";

export default function ChevronUp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" {...props}>
      <path d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
    </svg>
  );
}
