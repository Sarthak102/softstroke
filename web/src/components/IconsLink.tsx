"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

// The icons page carries every icon (~730 KB), too heavy to prefetch on every page view,
// so it is fetched on intent: pointer over or keyboard focus, usually 100-300ms before the click.
export function IconsLink({ href = "/icons/", ...props }: Omit<ComponentProps<typeof Link>, "href" | "prefetch"> & { href?: string }) {
  const router = useRouter();
  const warm = () => router.prefetch(href);
  return <Link href={href} prefetch={false} onPointerEnter={warm} onFocus={warm} {...props} />;
}
