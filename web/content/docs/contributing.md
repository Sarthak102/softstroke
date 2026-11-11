---
title: Contributing
description: Request an icon, report a bug, or draw one yourself.
---

## Requests and bugs

Open an issue on [GitHub](https://github.com/Sarthak102/softstroke/issues) with the icon you need and where you'd use it.

## Drawing an icon

Source icons live in `icons/*.svg`. Each needs 4 to 6 search words in `keywords.json` and a category in `categories.json`; the build fails without them. Then run:

```bash
python3 scripts/lint_joins.py          # sharp vertices, line ends that miss a stroke
python3 scripts/bbox.py $(ls icons | sed 's/.svg//')   # icons off-centre or outside the live area (pass names)
.venv/bin/python scripts/solids.py     # regenerate the solid set
.venv/bin/python scripts/lint_solid.py # check the solids
.venv/bin/python scripts/font.py       # regenerate the icon font
npm test                               # build every package and render every icon
```

`npm run preview` shows every icon at 16 to 32px in light and dark.
