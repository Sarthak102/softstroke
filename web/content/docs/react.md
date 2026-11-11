---
title: React
description: Use Softstroke icons as React components.
---

```bash
npm i @softstroke/react
```

Works with React 17 and newer, including Next.js (server and client components), Vite and Remix.

## Usage

```tsx
import { BellIcon, HomeIcon } from "@softstroke/react";

<HomeIcon />
<BellIcon size={20} color="#2563eb" strokeWidth={2} />
```

## Solid icons

Every icon has a solid twin under the same name in `@softstroke/react/solid`. Rename one on import when you need both:

```tsx
import { HomeIcon } from "@softstroke/react";
import { HomeIcon as HomeSolidIcon } from "@softstroke/react/solid";

{active ? <HomeSolidIcon /> : <HomeIcon />}
```

## Props

| Prop | Default | Notes |
|---|---|---|
| `size` | `24` | Width and height, a number (px) or any CSS length |
| `color` | `currentColor` | Stroke color, or fill color for solid icons |
| `strokeWidth` | `1.5` | Stroke icons only |

Any other SVG prop (`className`, `style`, `onClick`, `aria-label`) is passed to the `<svg>`. Components forward refs.

## Single-icon imports

The package is tree-shakable, so named imports from the root only ship what you use. If your bundler can't tree-shake, import one file:

```tsx
import HomeIcon from "@softstroke/react/icons/home";
```
