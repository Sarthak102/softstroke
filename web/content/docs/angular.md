---
title: Angular
description: Use Softstroke icons as standalone Angular components.
---

```bash
npm i @softstroke/angular
```

Works with Angular 17 and newer. Every icon is a standalone component, so you import only the icons a component uses.

## Usage

```ts
import { Component } from "@angular/core";
import { HomeIcon } from "@softstroke/angular";
import { HomeIcon as HomeSolidIcon } from "@softstroke/angular/solid";

@Component({
  selector: "app-toolbar",
  imports: [HomeIcon, HomeSolidIcon],
  template: `
    <ss-home [size]="24" />
    <ss-home-solid color="#2563eb" />
  `,
})
export class Toolbar {}
```

Selectors are `ss-<name>` for stroke and `ss-<name>-solid` for solid, so both styles can sit in the same template.

## Inputs

| Input | Default | Notes |
|---|---|---|
| `size` | `24` | Number or CSS length |
| `color` | `currentColor` | Stroke color, or fill color for solid icons |
| `strokeWidth` | `1.5` | Stroke icons only |

The host element is `display: inline-flex`. Put `class` and `style` on it as you would on any element.

## Accessibility

The inner `<svg>` is always hidden from screen readers. Add `aria-label` to the host to make the icon meaningful: the host then gets `role="img"`.

```html
<ss-bell aria-label="Notifications" />
```
