---
title: Accessibility
description: Decorative by default, labeled when the icon carries meaning.
---

## Decorative icons

Icons are hidden from screen readers by default (`aria-hidden="true"`). That's right for icons next to a text label:

```tsx
<button><TrashIcon /> Delete</button>
```

## Meaningful icons

When an icon is the only content of a control, label the control:

```tsx
<button aria-label="Delete"><TrashIcon /></button>
```

Or label the icon itself. Passing `aria-label` removes `aria-hidden`:

```tsx
<BellIcon aria-label="Notifications" />
```

In Angular, put `aria-label` on the host element; it gets `role="img"`.

## Contrast

Icons that carry meaning need a 3:1 contrast ratio against their background (WCAG 1.4.11). Light gray icons on white usually fail; check them like you check text.
