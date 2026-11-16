import { ChevronDownIcon } from "@softstroke/react";
import type { ComponentProps } from "react";

// A native select (keyboard, mobile pickers) drawn with our chevron instead of the browser's arrow.
export function Select({ className = "", ...props }: ComponentProps<"select">) {
  return (
    <span className={`select ${className}`}>
      <select {...props} />
      <ChevronDownIcon size={16} aria-hidden />
    </span>
  );
}
