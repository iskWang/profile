---
name: Profile Delivery Record
description: A precise, bilingual personal site presented as a printed delivery-acceptance form.
colors:
  desk: "oklch(0.93 0.01 245)"
  paper: "oklch(0.985 0.004 240)"
  paper-deep: "oklch(0.955 0.008 240)"
  ink: "oklch(0.21 0.02 255)"
  ink-soft: "oklch(0.45 0.02 255)"
  form: "oklch(0.44 0.11 255)"
  line: "oklch(0.44 0.11 255 / 0.3)"
  seal: "oklch(0.55 0.2 28)"
  desk-dark: "oklch(0.15 0.018 255)"
  paper-dark: "oklch(0.19 0.02 255)"
  paper-deep-dark: "oklch(0.23 0.022 255)"
  ink-dark: "oklch(0.94 0.01 240)"
  ink-soft-dark: "oklch(0.76 0.015 245)"
  form-dark: "oklch(0.78 0.09 250)"
  line-dark: "oklch(0.78 0.09 250 / 0.28)"
  seal-dark: "oklch(0.68 0.18 28)"
typography:
  display:
    fontFamily: "'Noto Serif TC', 'Songti TC', serif"
    fontWeight: 700
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'PingFang TC', 'Noto Sans TC', 'Microsoft JhengHei', system-ui, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.7
  data:
    fontFamily: "'JetBrains Mono Variable', ui-monospace, 'SF Mono', Menlo, monospace"
rounded: {}
spacing: {}
components: {}
---

# Design System: Profile Delivery Record

## Overview

**Creative North Star: "Delivery Record"**

The site reads as a completed acceptance form: a sheet on a desk, printed furniture, filled-in information, and a restrained hand-stamped sign-off. The visual language is orderly and legible, with a quiet distinction between the form's printed structure and its recorded content.

**Key Characteristics:**
- A centered paper sheet with a printed double frame.
- Form rules and labels use form ink; content uses readable ink.
- Seal geometry carries status, with cinnabar reserved for seals.

## Colors

Cool blue-gray form ink and paper neutrals establish the document; cinnabar is a deliberately scarce mark. Values are defined in the frontmatter for both themes.

### Primary
- **Form ink** (`{colors.form}`): Printed headings, labels, rules, links, and controls.
- **Cinnabar seal** (`{colors.seal}`): Stamped seal artwork only; never use as a general accent.

### Neutral
- **Desk** (`{colors.desk}`): Surrounding surface behind the sheet.
- **Paper** (`{colors.paper}`): Sheet and field backgrounds.
- **Deep paper** (`{colors.paper-deep}`): Secondary paper tone where needed.
- **Ink** (`{colors.ink}`): Entered content and primary text.
- **Soft ink** (`{colors.ink-soft}`): Supporting details and metadata.
- **Rule** (`{colors.line}`): Fine dividers and grid lines.

### Named Rules
**The Seal-Only Red Rule.** Cinnabar belongs to seal marks, not links, headings, or controls.

## Typography

**Display Font:** Noto Serif TC 700 (with Songti TC, serif fallback)  
**Body Font:** PingFang TC (with Noto Sans TC, Microsoft JhengHei, system UI, sans-serif fallback)  
**Label/Mono Font:** JetBrains Mono Variable (with ui-monospace, SF Mono, Menlo, monospace fallback)

**Character:** A firm serif voice gives headings a formal document character; the system CJK sans stack keeps reading clear. Mono is reserved for numbers, IDs, dates, and code.

### Hierarchy
- **Display** (700, responsive sizes): H1–H3 and signature/name emphasis; headings use tight tracking.
- **Body** (400, 1rem, 1.7 line-height): Main prose and form values.
- **Label** (form-ink, compact with letter spacing): Printed field labels and table headings.
- **Data** (tabular numerals): Numbers, document IDs, dates, and code only.

### Named Rules
**The Recorded-Data Rule.** Do not set ordinary prose in mono; reserve it for identifiers and machine-like values.

## Layout

A single sheet is centered in a flexible desk gutter and capped at 76rem. It sits below a fixed masthead; the header is taller on narrow screens and shortens at 60rem. The document uses generous separation between major parts. Field grids use 1px gaps over the line color so the gap itself prints the rule. At 40rem and below, ledger rows become stacked, labeled records rather than forcing a squeezed table. Clause rows also simplify to a two-column layout.

## Elevation & Depth

Depth is mostly tonal: the desk differs from the paper, and paper-deep can distinguish nested surfaces. The sheet alone uses a restrained two-layer shadow (`--shadow-sheet` in the source); avoid hard, prominent shadows. Printed borders and ruled divisions do the structural work.

## Shapes

The sheet is rectangular and unrounded, with a double printed frame: 2px outer form-ink rule and 1px inner rule inset by 4px. Fields are square-edged paper regions separated by straight rules. No pill or badge silhouette. Seal silhouettes are intentionally irregular circles or squares; shape, not color, determines status.

## Components

### Sheet and form masthead
The page is a framed acceptance document. Keep title, optional seal legend, and document number in one printed top strip. Legend seals use the printed form-ink variant, distinct from stamped seals.

### Fields and ruled grids
Labels use form ink and compact tracking; values use ink. Preserve the visible 1px grid gaps. Side labels may run vertically with a fine dividing rule.

### Section bars
Open each document part with a clear heading, optional mono count, and optional text action. Maintain the form-rule structure rather than enclosing headings in cards.

### Ledgers
Use semantic table structure with fine row and column rules. Below 40rem, visually stack each record and expose its column name as a label; inventory tables remain a simple single-column list.

### Clause lists
Numbered clauses use ruled rows and a stable number/content relationship. Keep addressable `#item-NN` IDs so a clause can be directly linked and highlighted.

### Seals
Round means delivered; square means in progress; filled square JW means signature. Keep the slight deterministic tilt and small ink gaps that make the mark feel pressed. The printed legend variant uses form ink. The only authored motion is a 380ms seal press; with reduced motion, the seal stays static and visible.

### Header / masthead
Use a fixed, compact document masthead with brand, horizontally navigable links, and utility controls. Active navigation is identified by a form-ink underline; keep the interface typographic and rule-based.

## Do's and Don'ts

### Do:
- **Do** keep printed form structure in form ink and entered content in ink.
- **Do** carry the same paper/form logic into dark mode: it is a carbon copy at night, with desk, paper, rules, and text all retuned together.
- **Do** let seal shape communicate state even without color.
- **Do** preserve keyboard focus visibility and the reduced-motion static state.

### Don't:
- **Don't** use red outside seals.
- **Don't** add cards, pills, or badges.
- **Don't** add eyebrow labels or gradient text.
- **Don't** use hard shadows or emoji icons.
