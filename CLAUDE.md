# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Responsive renewal of `https://jkcf.or.jp/` — a Japanese cultural exchange foundation site. Built with plain HTML, CSS, and Vanilla JavaScript. No build tools, no package manager, no external frameworks.

## Workflow Instructions

**Always read `AGENTS.md` and `CURRENT_TASK.md` before touching any file.** These files define which sections are in scope for the current work iteration. Only implement what `CURRENT_TASK.md` explicitly requests — do not build ahead.

## File Structure

```
index.html          ← Main page
about.html
activities.html
stories.html
news.html
membership.html
css/index.css       ← Main page styles only
css/about.css       ← Each subpage has its own CSS
css/...
js/index.js         ← Main page JS only
js/subpage.js       ← Shared JS for all subpages
images/             ← Static assets
```

## Key Constraints

**Incremental build order** — sections are built one at a time in this order:
`HEADER → VISUAL → SECTION 01 → … → SECTION 05 → FOOTER 01 → FOOTER 02`

Unrequested sections stay as HTML comments only — no placeholder content.

**Language** — Japanese is the default language. Korean translation is toggled via a language button and persisted with `localStorage`. Both languages live in the same HTML file using `data-ja` / `data-ko` attributes on text nodes.

**Font** — `Zen Kaku Gothic New` from Google Fonts only. No other fonts.

**Colors** (defined in `:root` at the top of each CSS file):
```css
--color-white: #ffffff;
--color-green: #11b1af;
--color-blue:  #0b7ac6;
--color-text:  #2b2929;
```

**Layout** — PC content inner max-width: `1500px`, mobile base width: `360px`, responsive breakpoint: `1024px`.

**CSS rules** — BEM naming, Flexbox/Grid layouts, no `!important`, CSS custom properties for all repeated values.

**JS rules** — Vanilla JS only, run after `DOMContentLoaded`, check element existence before binding events, sync ARIA attributes with UI state.

**Images** — If a required image is missing, report it to the user. Do not fabricate logos or use CSS shapes as image substitutes.
