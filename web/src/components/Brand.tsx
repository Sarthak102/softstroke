import { TypeIcon } from "@softstroke/react";

export type Logo = { path: string } | null;

// A framework mark from simple-icons (CC0), in the current color; null falls back to our type icon.
export function Brand({ logo, size = 26 }: { logo: Logo; size?: number }) {
  if (!logo) return <TypeIcon size={size} />;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d={logo.path} />
    </svg>
  );
}
