# Softstroke for Flutter

Soft, rounded open-source icons, in a stroke and a solid style. 24px grid, 1.5px stroke, round caps and joins. MIT licensed.

Browse the icons: https://softstroke.github.io/softstroke/icons/

## Install

```sh
flutter pub add softstroke
```

## Use

```dart
import 'package:softstroke/softstroke.dart';

Icon(SoftstrokeIcons.home)                         // stroke
Icon(SoftstrokeIcons.homeSolid)                    // solid
Icon(SoftstrokeIcons.bell, size: 32, color: Color(0xFF2563EB))
```

Names are the website's names in camelCase: `arrow-up-right` is `SoftstrokeIcons.arrowUpRight`, and its solid twin is `SoftstrokeIcons.arrowUpRightSolid`.

The icons are a font, so `size` and `color` work like any `Icon`. The stroke is fixed at 1.5 (scaled with the size). Release builds keep only the icons you use (Flutter's icon tree shaking is on by default).

Accessibility: pass `semanticLabel` when the icon means something on its own, e.g. `Icon(SoftstrokeIcons.search, semanticLabel: 'Search')`.

## License

MIT. Source and other platforms (React, React Native, Vue, Svelte, Angular, SVG, web font): https://github.com/softstroke/softstroke
