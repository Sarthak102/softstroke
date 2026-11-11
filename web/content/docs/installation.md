---
title: Installation
description: Install the package for your stack and render your first icon.
---

Every package exports the same icon names, so what you learn in one carries over to the others.

## Choose a package

| Stack | Install |
|---|---|
| React | `npm i @softstroke/react` |
| React Native / Expo | `npx expo install react-native-svg && npm i @softstroke/react-native` |
| Vue 3 | `npm i @softstroke/vue` |
| Svelte 5 | `npm i @softstroke/svelte` |
| Angular | `npm i @softstroke/angular` |
| SVG files and sprites | `npm i @softstroke/svg` |
| Icon font | `npm i @softstroke/font` |

pnpm, yarn and bun work the same way.

## Your first icon

```tsx
import { HomeIcon } from "@softstroke/react";

export function Nav() {
  return <HomeIcon />;
}
```

That renders a 24px stroke icon in the current text color. To use the solid style, import the same name from `/solid`:

```tsx
import { HomeIcon } from "@softstroke/react/solid";
```

## Naming

Icon files use kebab-case (`arrow-up-right`). Components use PascalCase with an `Icon` suffix (`ArrowUpRightIcon`). The icon font and Angular selectors keep the kebab-case name (`ss-arrow-up-right`).
