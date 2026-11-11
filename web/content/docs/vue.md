---
title: Vue
description: Use Softstroke icons as Vue 3 components.
---

```bash
npm i @softstroke/vue
```

Works with Vue 3.3 and newer, including Nuxt.

## Usage

```vue
<script setup>
import { HomeIcon } from "@softstroke/vue";
import { HomeIcon as HomeSolidIcon } from "@softstroke/vue/solid";
</script>

<template>
  <HomeIcon :size="24" />
  <HomeSolidIcon color="#2563eb" />
</template>
```

## Props

| Prop | Default | Notes |
|---|---|---|
| `size` | `24` | Number or CSS length |
| `color` | `currentColor` | Stroke color, or fill color for solid icons |
| `stroke-width` | `1.5` | Stroke icons only |

Other attributes (`class`, `style`, `aria-label`, listeners) go to the `<svg>`. Content in the default slot is placed inside the `<svg>`, which is useful for a `<title>`.

## Single-icon imports

```ts
import HomeIcon from "@softstroke/vue/icons/home";
```
