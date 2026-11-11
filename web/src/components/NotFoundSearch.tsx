"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchIcon } from "@softstroke/react";

export function NotFoundSearch() {
  const [q, setQ] = useState("");
  const router = useRouter();
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(q.trim() ? `/icons/?q=${encodeURIComponent(q.trim())}` : "/icons/");
      }}
      className="liquid mx-auto mt-8 flex max-w-md items-center gap-2 rounded-full py-1.5 pl-4 pr-1.5"
    >
      <SearchIcon size={18} className="shrink-0 text-muted" />
      <label htmlFor="nf-q" className="sr-only">Search icons</label>
      <input id="nf-q" value={q} maxLength={50} onChange={(e) => setQ(e.target.value)} placeholder="Search 310 icons" className="h-10 min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted focus-visible:outline-none" />
      <button type="submit" className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink active:scale-[0.98]">Search</button>
    </form>
  );
}
