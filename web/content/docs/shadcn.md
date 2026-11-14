---
title: shadcn
description: Copy one icon into your project as an editable component with the shadcn CLI.
---

Every icon is also a [shadcn](https://ui.shadcn.com) registry item. The CLI copies a single, standalone component into your project: no package to install, and the file is yours to edit.

```bash
npx shadcn@latest add {site}/r/home.json
```

This creates `components/icons/home.tsx`, which exports `HomeIcon`. For the solid style add `-solid` to the name; that file exports `HomeSolidIcon`, so both styles can live side by side.

```bash
npx shadcn@latest add {site}/r/home-solid.json
```

## Shorter names with a namespace

Add Softstroke to `registries` in your `components.json` once:

```json
{
  "registries": {
    "@softstroke": "{site}/r/{name}.json"
  }
}
```

Then add icons by name, several at a time:

```bash
npx shadcn@latest add @softstroke/home @softstroke/bell @softstroke/user-solid
```

## Usage

The copied component takes the same props as `@softstroke/react`:

```tsx
import { HomeIcon } from "@/components/icons/home";

<HomeIcon size={20} strokeWidth={2} className="text-blue-600" />
<HomeIcon aria-label="Home" />
```

`size` (default 24), `color` (default `currentColor`) and `strokeWidth` (default 1.5, stroke icons only), plus any SVG attribute. Icons are decorative (`aria-hidden`) unless you give them an `aria-label`. A `ref` reaches the `<svg>` element.

## shadcn or the npm package?

Use shadcn when you want a few icons you can edit by hand. Use [`@softstroke/react`](/docs/react/) when you want all {icon-count} with updates through your package manager; unused icons are tree-shaken either way.
