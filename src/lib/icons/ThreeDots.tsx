import React from "react";

export default function ThreeDots(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" {...props}>
      <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
  );
}
