---
title: CDN
description: Load icons straight from jsDelivr, with nothing to install.
---

Every published file is on jsDelivr. Pin a version in production so an update never changes your UI unexpectedly.

## Single icons

```html
<img
  src="https://cdn.jsdelivr.net/npm/@softstroke/svg@1/dist/icons/home.svg"
  width="24" height="24" alt="Home" />
```

An `<img>` can't inherit the text color, so icons loaded this way render black. For colors that follow your CSS, inline the SVG, use the sprite, or use the [icon font](/docs/font/).

## Sprite

```html
<svg width="24" height="24" aria-hidden="true">
  <use href="https://cdn.jsdelivr.net/npm/@softstroke/svg@1/dist/sprite.svg#home" />
</svg>
```

Most browsers block `<use>` across origins. Download the sprite and serve it from your own domain instead.

## Icon font

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@softstroke/font@1/dist/softstroke.css" />
```

See [Icon font](/docs/font/) for usage.
