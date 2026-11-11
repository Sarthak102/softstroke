---
title: Solid icons
description: How the solid style works and when to use it.
---

Every stroke icon has a solid twin with the same name and the same outer outline, so swapping one for the other never shifts your layout.

## Importing

| Package | Solid entry point |
|---|---|
| React | `@softstroke/react/solid` |
| React Native | `@softstroke/react-native/solid` |
| Vue | `@softstroke/vue/solid` |
| Svelte | `@softstroke/svelte/solid` |
| Angular | `@softstroke/angular/solid` (selectors `ss-<name>-solid`) |
| SVG | `dist/solid/icons/<name>.svg`, `dist/solid-sprite.svg` |
| Icon font | class `ss-solid` |

## When to use solid

Use stroke for resting states and solid for the selected one: the active tab in a tab bar, a liked heart, a pinned item. One style per state keeps interfaces calm.

```tsx
{tab === "home" ? <HomeSolidIcon /> : <HomeIcon />}
```

## How solids are drawn

A solid icon is its stroke icon's outer edge, filled. Details inside it (a door, a clasp, lines on a page) are cut out at the stroke's own position and width. Parts that sit behind other parts, like a wallet's flap, keep a small gap so the layering still reads.
