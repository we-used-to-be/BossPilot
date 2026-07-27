---
name: linear
description: "Linear design system — ultra-minimal dark-canvas product UI with lavender-blue accent. For project management tools, dark SaaS UIs, and precision engineering interfaces."
version: 1.0.0
---

# Linear Design System

A near-black product-focused design system built around `#010102` canvas, light gray text (`#f7f8f8`), and the signature Linear lavender-blue (`#5e6ad2`) as the single chromatic accent. Dense, technical, and quietly luxurious.

## Quick Reference

- **Dark canvas only** — `#010102` background, never pure black
- **Single accent** — lavender-blue `#5e6ad2` used ONLY for brand mark, primary CTA, focus ring, link emphasis
- **Surface ladder** — 4-step hierarchy (canvas → surface-1 → surface-2 → surface-3 → surface-4)
- **No atmospheric gradients, no spotlight cards, no second chromatic color**
- **Buttons: `rounded.md` 8px** — never pill-round CTAs
- **Cards: `rounded.lg` 12px** with 1px hairline borders
- **Font: Inter** (substitute for Linear custom fonts), weight 400–600

## Colors

| Token | Value | Role |
|-------|-------|------|
| `--canvas` | `#010102` | Page background |
| `--surface-1` | `#0f1011` | Cards, panels |
| `--surface-2` | `#141516` | Featured cards, hover |
| `--surface-3` | `#18191a` | Sub-nav, dropdowns |
| `--hairline` | `#23252a` | Card borders, dividers |
| `--hairline-strong` | `#34343a` | Input borders, focus |
| `--ink` | `#f7f8f8` | Headlines, body |
| `--ink-muted` | `#d0d6e0` | Secondary text |
| `--ink-subtle` | `#8a8f98` | Tertiary, deselected |
| `--ink-tertiary` | `#62666d` | Disabled, footnotes |
| `--primary` | `#5e6ad2` | Brand, CTA, focus |
| `--primary-hover` | `#828fff` | Button hover |
| `--primary-focus` | `#5e69d1` | Focus ring tint |
| `--success` | `#27a644` | Status pills |
| `--danger` | `#e5484d` | Error, destructive |

## Typography

- **Font**: Inter (400/500/600), fallback `SF Pro Display, -apple-system, system-ui, sans-serif`
- **Mono**: JetBrains Mono or Geist Mono (400), fallback `ui-monospace, SF Mono, Menlo, monospace`
- Negative tracking on headings, zero on body

| Role | Size | Weight | Line Height | Letter Spacing |
|------|------|--------|-------------|----------------|
| Page title | 22px | 600 | 1.15 | -0.5px |
| Card title | 15px | 500 | 1.25 | -0.3px |
| Section heading | 13px | 500 | 1.30 | 0.4px |
| Body | 13px | 400 | 1.50 | 0 |
| Body-sm | 12px | 400 | 1.40 | 0 |
| Caption | 11px | 400 | 1.40 | 0 |
| Button | 13px | 500 | 1.20 | 0 |
| Mono | 12px | 400 | 1.50 | 0 |

## Border Radius

| Token | Value | Use |
|-------|-------|-----|
| `xs` | 4px | Status badges, chips |
| `sm` | 6px | Inline tags |
| `md` | 8px | Buttons, inputs |
| `lg` | 12px | Cards, panels |
| `xl` | 16px | Large containers |
| `pill` | 9999px | Status pills, avatars |

## Spacing

| Token | Value |
|-------|-------|
| `xs` | 4px |
| `sm` | 8px |
| `md` | 12px |
| `lg` | 16px |
| `xl` | 24px |
| `xxl` | 32px |

## Components

### Buttons
- **Primary**: `bg=primary` `text=white` `rounded=8px` `padding=6px 12px` `font=500 13px`
- **Secondary**: `bg=surface-1` `text=ink` `border=1px hairline` `rounded=8px` `padding=6px 12px`
- **Ghost**: `bg=transparent` `text=ink-muted` `rounded=8px` `padding=6px 12px`
- **Danger**: `bg=transparent` `text=#e5484d` `rounded=8px` `padding=6px 12px`

### Cards
- `bg=surface-1` `border=1px hairline` `rounded=12px` `padding=16px`
- Card title: `500 15px` with `-0.3px` tracking

### Inputs
- `bg=surface-1` `text=ink` `border=1px hairline-strong` `rounded=8px` `padding=8px 10px`
- Focus: `border=primary 2px` at 50% opacity

### Navigation
- Bottom nav: `bg=canvas` `border-top=1px hairline` `height=56px`
- Active item: `text=primary`, inactive: `text=ink-subtle`
- Nav icons: 18px, stroke-width 1.5

## Layout

- Max content width: 1280px
- Card gaps: 8–10px
- Section spacing: 16px
- Inside card padding: 12–16px
- Single column on narrow (<480px), grid on wider

## Do's and Don'ts

### Do
- Use `#010102` canvas as the anchor surface
- Reserve lavender `#5e6ad2` ONLY for: brand mark, primary CTA, focus ring, active nav
- Use the surface ladder for hierarchy (never skip levels)
- Use 8px radius on buttons/inputs, 12px on cards
- Pair weight 500/600 headings with weight 400 body

### Don't
- Don't ship a light-mode page
- Don't use lavender as a section background or card fill
- Don't introduce a second chromatic accent (no orange, pink, green for marketing)
- Don't add atmospheric gradients or spotlight cards
- Don't pill-round CTAs
- Don't use `#000000` true black as the canvas