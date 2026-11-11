// The Softstroke mark (brand/logo-mark.svg), inlined so it takes currentColor.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M17.535 2.334L22 10.067L17.498 10.067L18.696 12.142A6.349 6.349 0 0 1 13.198 21.666L6.465 21.666L2 13.933L6.502 13.933L5.304 11.858A6.349 6.349 0 0 1 10.802 2.334ZM10.802 6.2L15.21 6.2L17.442 10.067L13.033 10.067L15.348 14.076A2.483 2.483 0 0 1 13.198 17.8L8.79 17.8L6.558 13.933L10.967 13.933L8.652 9.924A2.483 2.483 0 0 1 10.802 6.2Z"
      />
    </svg>
  );
}
