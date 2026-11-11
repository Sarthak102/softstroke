---
title: SVG and sprite
description: Plain SVG files, sprites and JSON for any stack or design tool.
---

```bash
npm i @softstroke/svg
```

## Files

| Path | Contents |
|---|---|
| `dist/icons/<name>.svg` | Stroke icons |
| `dist/solid/icons/<name>.svg` | Solid icons |
| `dist/sprite.svg` | All stroke icons as `<symbol>`s |
| `dist/solid-sprite.svg` | All solid icons as `<symbol>`s |
| `dist/icons.json`, `dist/icons-solid.json` | Shapes as `[tag, attributes]` lists |
| `dist/keywords.json` | Search keywords per icon |

Every file uses `currentColor`, so icons take the text color.

## Sprite

Serve the sprite once and reference icons by name:

```html
<svg width="24" height="24" aria-hidden="true">
  <use href="/sprite.svg#home" />
</svg>
```

## Inline SVG

Copy a file's contents into your markup, or use the [icon browser](/icons/) to copy any icon as SVG or JSX.

## JSON

`icons.json` maps each name to its shapes, so you can render icons with any library:

```json
{ "home": [["path", { "d": "M3.5 12.5..." }]] }
```
