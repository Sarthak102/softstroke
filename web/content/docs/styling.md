---
title: Styling
description: Size, color and stroke width, in props or in CSS.
---

## Color

Icons use `currentColor` by default (except in React Native), so they take the color of the surrounding text. Change the parent's color, or pass `color`:

```tsx
<span className="text-blue-600"><HomeIcon /></span>
<HomeIcon color="#2563eb" />
```

## Size

The icons are drawn for **24px** and stay crisp at **20px** and **16px**. Pass `size`, or size the `<svg>` with CSS:

```tsx
<HomeIcon size={20} />
<HomeIcon className="size-5" />
```

## Stroke width

`strokeWidth` changes the line weight of stroke icons. The set is designed at **1.5**. Values between 1.25 and 2 keep the soft look; heavier strokes start to close small counters. Solid icons have no stroke, so the prop does nothing on them.

## Matching text

Next to text, size icons to roughly the text's line height and center them with flex:

```tsx
<button className="inline-flex items-center gap-2">
  <DownloadIcon size={18} /> Download
</button>
```
