---
name: notion
description: "Notion design system — warm minimalism light-canvas product UI with signature purple accent. For workspace tools, productivity dashboards, and clean editorial interfaces."
version: 1.0.0
---

# Notion Design System

A warm-minimalism light-canvas design system built around `#ffffff` canvas, soft off-white surfaces (`#f6f5f4`), and the signature Notion purple (`#5645d4`) as the single chromatic accent. Clean, readable, and quietly productive — with optional pastel card tints for category differentiation.

## Quick Reference

- **Light canvas only** — `#ffffff` background, never pure black canvas
- **Single accent** — Notion purple `#5645d4` used ONLY for brand mark, primary CTA, focus ring, link emphasis
- **Surface ladder** — 4-step hierarchy (canvas → surface-soft → surface → surface-gray)
- **Optional pastel tints** — peach/rose/mint/lavender/sky/yellow for category cards (not required)
- **Buttons: `rounded.md` 8px** — never pill-round CTAs
- **Cards: `rounded.lg` 12px** with 1px hairline borders
- **Font: Inter** (substitute for Notion Sans), weight 400–600

## Colors

| Token | Value | Role |
|-------|-------|------|
| `--canvas` | `#ffffff` | Page background |
| `--surface-soft` | `#fafaf9` | Hover states, soft fills |
| `--surface-1` | `#f6f5f4` | Cards, panels |
| `--surface-2` | `#f0eeec` | Featured cards, dropdowns |
| `--surface-3` | `#e9e7e3` | Sub-nav, elevated surfaces |
| `--hairline` | `#e5e3df` | Card borders, dividers |
| `--hairline-strong` | `#c8c4be` | Input borders, focus |
| `--ink` | `#1a1a1a` | Headlines, primary body |
| `--ink-muted` | `#5d5b54` | Secondary text |
| `--ink-subtle` | `#787671` | Tertiary, deselected |
| `--ink-tertiary` | `#a4a097` | Disabled, footnotes |
| `--primary` | `#5645d4` | Brand, CTA, focus |
| `--primary-hover` | `#4534b3` | Button hover |
| `--primary-focus` | `#3a2a99` | Focus ring tint |
| `--success` | `#1aae39` | Status pills |
| `--danger` | `#e03131` | Error, destructive |
| `--warning` | `#dd5b00` | Warnings, caution |
| `--tint-peach` | `#ffe8d4` | Category card |
| `--tint-rose` | `#fde0ec` | Category card |
| `--tint-mint` | `#d9f3e1` | Category card |
| `--tint-lavender` | `#e6e0f5` | Category card |
| `--tint-sky` | `#dcecfa` | Category card |
| `--tint-yellow` | `#fef7d6` | Category card |

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
- **Danger**: `bg=transparent` `text=#e03131` `rounded=8px` `padding=6px 12px`

### Cards
- `bg=surface-1` `border=1px hairline` `rounded=12px` `padding=16px`
- Card title: `500 15px` with `-0.3px` tracking

### Inputs
- `bg=canvas` `text=ink` `border=1px hairline-strong` `rounded=8px` `padding=8px 10px`
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
- Use `#ffffff` canvas as the anchor surface
- Reserve purple `#5645d4` ONLY for: brand mark, primary CTA, focus ring, active nav
- Use the surface ladder for hierarchy (never skip levels)
- Use 8px radius on buttons/inputs, 12px on cards
- Pair weight 500/600 headings with weight 400 body
- Use pastel tints sparingly for category differentiation

### Don't
- Don't ship a dark-mode page
- Don't use purple as a section background or card fill
- Don't introduce a second chromatic accent (no orange, pink for marketing)
- Don't add atmospheric gradients or spotlight cards
- Don't pill-round CTAs
- Don't overuse pastel tints on every card
