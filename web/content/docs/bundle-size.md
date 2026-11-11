---
title: Bundle size
description: What each icon costs and how to ship only what you use.
---

An icon is about **0.4 KB** before compression: one small module with optimized path data and no runtime beyond your framework.

## Tree-shaking

The React, Vue, Svelte and Angular packages are side-effect free ES modules. Named imports from the package root are tree-shaken by Vite, webpack, Rollup, esbuild and the Angular CLI, so your bundle gets only the icons you import.

## Metro (React Native)

Metro doesn't tree-shake. Import single files in large apps:

```tsx
import HomeIcon from "@softstroke/react-native/icons/home";
```

## Icon font

The font always loads the whole set, about 48 KB per style. That's the trade for a no-build setup.
