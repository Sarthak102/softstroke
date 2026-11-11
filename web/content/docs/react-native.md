---
title: React Native
description: Use Softstroke icons in React Native and Expo apps.
---

```bash
npx expo install react-native-svg
npm i @softstroke/react-native
```

The package renders through `react-native-svg` (version 13 or newer), which Expo includes.

## Usage

```tsx
import { HomeIcon } from "@softstroke/react-native";
import { HomeIcon as HomeSolidIcon } from "@softstroke/react-native/solid";

<HomeIcon size={24} color="#0b2545" />
<HomeSolidIcon color="#2563eb" />
```

There is no `currentColor` in React Native, so `color` defaults to `#000`. Pass your theme color explicitly.

## Keep the bundle small

Metro doesn't tree-shake. In a large app, import single icons so only those end up in the bundle:

```tsx
import CalendarIcon from "@softstroke/react-native/icons/calendar";
import CalendarSolidIcon from "@softstroke/react-native/solid/icons/calendar";
```

## Props

Same as React: `size`, `color`, `strokeWidth`, plus any `react-native-svg` prop.
