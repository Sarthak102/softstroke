---
title: Design rules
description: The grid and rules every Softstroke icon follows.
---

## The grid

- **24 x 24** canvas. Drawn edges stay between 1.75 and 22.25, and every icon is centred within 0.5 of the middle. A few are offset on purpose so they look centred (play's triangle sits slightly right).
- **1.5px** stroke, round caps, round joins.
- **Squircle corners** (continuous curves) instead of circular radii, for a softer silhouette.
- **No sharp vertices:** every corner is rounded, even small ones.

## Families

Related icons reuse their base icon's paths exactly. Every calendar variant uses the calendar's frame and rings; every "-off" icon uses the same slash.

## Solid

A solid icon is its stroke icon's outline, filled, with details cut out where the stroke draws them. Line-only icons (arrows, chevrons, plus) become the stroke drawn at 2.25. See [Solid icons](/docs/solid/).
