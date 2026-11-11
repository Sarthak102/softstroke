---
title: Icon font
description: All 310 icons in stroke and solid from one CSS link.
---

The icon font is for places where you can't run a build: plain HTML, WordPress, Webflow, or a quick prototype. Each icon is a character in a font, so it sizes and colors like text.

## Install

From the CDN:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@softstroke/font@1/dist/softstroke.css" />
```

Or from npm, for bundlers that import CSS:

```bash
npm i @softstroke/font
```

```js
import "@softstroke/font/softstroke.css";
```

## Usage

```html
<i class="ss ss-home"></i>         <!-- stroke -->
<i class="ss-solid ss-home"></i>   <!-- solid -->
```

`ss` picks the stroke font, `ss-solid` the solid font, and `ss-<name>` the icon. Names match the [icon browser](/icons/).

## Size and color

```css
.ss, .ss-solid { font-size: 24px; color: #2563eb; }
```

Icons follow `font-size` and `color` like text, and sit on the text baseline with `vertical-align: -0.125em`.

## What the font can't do

- **Stroke width is fixed at 1.5.** A font glyph is a filled shape, so each stroke icon is its 1.5px outline. For other weights, use a framework package or SVG.
- **One color per icon**, the text color.
- **The whole set loads**, about 48 KB per style as WOFF2. A framework package ships only the icons you import.

## Formats

WOFF2 only, which every current browser supports.

## Accessibility

Icon font glyphs are characters in the Private Use Area. Hide decorative icons from screen readers and label meaningful ones:

```html
<i class="ss ss-bell" aria-hidden="true"></i>
<button aria-label="Notifications"><i class="ss ss-bell" aria-hidden="true"></i></button>
```
