# Softstroke

Soft, rounded open-source icons for web and mobile, in two styles: **stroke** (24px grid, 1.5px stroke) and **solid**. MIT licensed.

| Package | For |
|---|---|
| `@softstroke/react` | React, Next.js, Vite, Remix |
| `@softstroke/react-native` | React Native, Expo (needs `react-native-svg`) |
| `@softstroke/svg` | Plain HTML, any framework: SVG files, a sprite, JSON |

## React

```bash
npm i @softstroke/react
```

```tsx
import { HomeIcon, BellIcon } from '@softstroke/react';

<HomeIcon />                                   // 24px, inherits the text color
<BellIcon size={20} color="#e5484d" strokeWidth={2} aria-label="Notifications" />
```

### Solid

Every icon has a solid twin with the same name, from the `/solid` entry point:

```tsx
import { HomeIcon } from '@softstroke/react/solid';
import { HomeIcon as HomeSolidIcon } from '@softstroke/react/solid'; // next to the stroke one
```

Solid icons take `size` and `color`; `strokeWidth` has no effect on them. The same `/solid` entry point exists in `@softstroke/react-native`, and `@softstroke/svg` ships `solid/icons/<name>.svg`, `solid-sprite.svg` and `icons-solid.json`.

## React Native / Expo

```bash
npx expo install react-native-svg && npm i @softstroke/react-native
```

```tsx
import { HomeIcon } from '@softstroke/react-native';
// Metro doesn't tree-shake: in big apps, import single icons to keep the bundle small
import CalendarIcon from '@softstroke/react-native/icons/calendar';

<HomeIcon size={24} color="#111" />
```

## Plain SVG

```html
<svg width="24" height="24"><use href="/sprite.svg#home" /></svg>
```

Single files are in `@softstroke/svg/icons/<name>.svg`.

## Props

| Prop | Default | |
|---|---|---|
| `size` | `24` | width and height |
| `color` | `currentColor` (web), `#000` (native) | stroke color (fill color for solid) |
| `strokeWidth` | `1.5` | |

Any other SVG prop (`className`, `style`, `onClick`, ...) is passed through.

## Accessibility

Icons are `aria-hidden` by default. When an icon is the only content of a button, put the label on the button, or pass `aria-label` to the icon.

## Contributing

Source icons live in `icons/*.svg`, each with search keywords in `keywords.json` (the build fails if one is missing). `npm run preview` shows them all at 16-32px in light and dark; `npm test` builds the packages and checks them; `npm run site` builds the docs site into `site/index.html`. Style rules: 24 grid, 1.5px round stroke, soft vertices and squircle corners (helpers in `scripts/geo.py`).

Checks to run on every new icon:

```bash
python3 scripts/lint_joins.py   # sharp vertices + line ends that miss a stroke (--fix snaps them)
python3 scripts/bbox.py <names> # live area + centring
```

Solid icons (`icons-solid/`) are generated from the stroke icons, never edited by hand. They need [shapely](https://shapely.readthedocs.io) as a dev-only tool:

```bash
python3 -m venv .venv && .venv/bin/pip install -r requirements-dev.txt
.venv/bin/python scripts/solids.py      # regenerate icons-solid/
.venv/bin/python scripts/lint_solid.py  # slivers, hairline gaps, tiny islands, live area
```

## License

MIT
