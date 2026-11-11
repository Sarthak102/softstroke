---
title: Svelte
description: Use Softstroke icons as Svelte 5 components.
---

```bash
npm i @softstroke/svelte
```

Built for Svelte 5 (runes) and SvelteKit. The package ships `.svelte` sources, so your app compiles them with your own Svelte version.

## Usage

```svelte
<script>
  import { HomeIcon } from "@softstroke/svelte";
  import { HomeIcon as HomeSolidIcon } from "@softstroke/svelte/solid";
</script>

<HomeIcon size={24} />
<HomeSolidIcon color="#2563eb" />
```

## Props

`size` (default `24`), `color` (default `currentColor`), `strokeWidth` (default `1.5`, stroke icons only). Any other attribute is passed to the `<svg>`, and children render inside it.

## Single-icon imports

```svelte
<script>
  import HomeIcon from "@softstroke/svelte/icons/home";
</script>
```
