export default function FilterVisibility(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" {...props}>
      <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
    </svg>
  );
}
