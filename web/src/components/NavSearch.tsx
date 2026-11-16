"use client";

import { SearchIcon } from "@softstroke/react";
import { openSearch } from "./Search";

// Opens the ⌘K search; shows the shortcut on wide screens.
export function NavSearch() {
  return (
    <button type="button" className="nav-search" onClick={openSearch} aria-label="Search icons and docs">
      <SearchIcon size={16} />
      <span>Search</span>
      <span className="kbd">⌘K</span>
    </button>
  );
}
