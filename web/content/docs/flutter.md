---
title: Flutter
description: Use Softstroke icons in Flutter apps on iOS, Android, web and desktop.
---

```bash
flutter pub add softstroke
```

The package ships the icons as two fonts (stroke and solid) and one `IconData` per icon. It works on every Flutter platform and needs Flutter 3.10 or newer.

## Usage

```dart
import 'package:softstroke/softstroke.dart';

Icon(SoftstrokeIcons.home)                                 // stroke
Icon(SoftstrokeIcons.homeSolid)                            // solid
Icon(SoftstrokeIcons.bell, size: 32, color: Color(0xFF2563EB))
```

Names are the website's names in camelCase: `arrow-up-right` is `SoftstrokeIcons.arrowUpRight`, and its solid twin is `SoftstrokeIcons.arrowUpRightSolid`.

## Size and color

`Icon` takes `size` and `color` as usual, or picks them up from `IconTheme`. The stroke width is fixed at 1.5 and scales with the size, because a font glyph is a filled outline.

## Bundle size

Release builds keep only the icons you use. Flutter's icon tree shaking is on by default, and it cut both fonts by about 96% in a test app with 12 icons. Keep icons as `SoftstrokeIcons.<name>` constants: building an `IconData` at runtime turns tree shaking off.

## Accessibility

Icons are decorative by default. Pass `semanticLabel` when an icon means something on its own:

```dart
IconButton(
  icon: Icon(SoftstrokeIcons.search),
  tooltip: 'Search',
  onPressed: search,
)
Icon(SoftstrokeIcons.alertCircle, semanticLabel: 'Error')
```
