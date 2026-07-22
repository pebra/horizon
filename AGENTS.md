# AGENTS.md

Guidance for AI agents working in this repository. Horizon is Shopify's flagship
first-party Liquid theme. There is no build step, package manager, or bundler in
this checkout — every file here is served directly by Shopify's theme engine. Read
[README.md](README.md) for project philosophy (web-native, server-rendered, lean).

## Repository layout

| Directory | Contents |
|---|---|
| `layout/` | `theme.liquid` (main wrapper) and `password.liquid`. Every page renders inside one of these. |
| `templates/` | JSON templates (`product.json`, `collection.json`, etc.) that compose sections. A few `.liquid` templates exist (`gift_card.liquid`). Alternate templates follow `name.suffix.json`. |
| `sections/` | Page-level building blocks, added/configured via the theme editor. Files prefixed with `main-` render the primary content for a template (e.g. `main-product.liquid`). `*-group.json` files define section groups (header, footer). |
| `blocks/` | Theme blocks nested inside sections or other blocks. Files prefixed with `_` (e.g. `_card.liquid`) are **private/internal blocks** — implementation detail not meant to be added directly by merchants. Files without a prefix are merchant-facing blocks with their own presets. |
| `snippets/` | Reusable Liquid partials included via `{% render %}`. No schema; take parameters instead. |
| `assets/` | Flat directory (no subfolders) of CSS, JS, SVG icons, and a couple JSON files. Referenced via `asset_url` / `inline_asset_content`. |
| `config/` | `settings_schema.json` (theme-wide settings definitions) and `settings_data.json` (default values). |
| `locales/` | Translation files. `en.default.json` is the source of truth for storefront strings; `en.default.schema.json` for editor/schema strings (`names`, `settings`, etc.). Other locales mirror the same keys. |
| `.cursor/rules/` | Detailed, per-topic coding standards (see below) — read these before writing non-trivial Liquid/CSS/JS. |

## Core building blocks

- **Sections** (`sections/*.liquid`): top-level, schema-driven components placed on a page via templates or section groups. Must include `{% schema %}` with a valid `name`, `settings`, optional `blocks`, and `presets`.
- **Blocks** (`blocks/*.liquid`): reusable, nestable components rendered either dynamically (merchant-added via `{% content_for 'blocks' %}`) or statically (`{% content_for 'block', type: '...', id: '...' %}`) by a developer. A block's schema declares its own `settings`, `blocks` (for nesting), and `presets`.
- **Snippets** (`snippets/*.liquid`): parameterized partials with no schema, invoked with `{% render 'name', param: value %}`. Always document parameters with `{% doc %}`.
- **Templates** (`templates/*.json`): declare which sections render on a given page type and in what order, plus their initial settings/blocks.
- **Theme settings** (`config/settings_schema.json`): global merchant-configurable options (colors, typography, layout) surfaced in the theme editor's "Theme settings" panel, distinct from per-section/block settings.

Only one `{% content_for 'blocks' %}` call is allowed per Liquid file — capture it into a variable first if it needs to be used in multiple branches.

## Conventions to follow

This repo has extensive, current `.cursor/rules/*.mdc` files — they are the
authoritative style guide and take priority over generic Liquid/CSS/JS habits.
Key ones, by topic:

- `liquid.mdc` — Liquid syntax, valid tags/filters, `{% doc %}` conventions, inline-vs-variable style
- `sections.mdc`, `blocks.mdc`, `snippets.mdc`, `templates.mdc`, `schemas.mdc` — structure and schema rules per file type
- `css-standards.mdc` — BEM naming, CSS variable scoping/namespacing, specificity limits, logical properties, nesting rules
- `javascript-standards.mdc` — the `@theme/component` Web Component framework (`assets/component.js`), async/await, event-driven communication between components, zero external dependencies
- `html-standards.mdc` — prefer native elements (`<details>`, `<dialog>`, `popover`) over custom JS; ID naming convention (`CamelCase` + section/block id)
- `localization.mdc` — all user-facing text must go through `{{ 'key' | t }}`, with new keys added to `locales/en.default.json`
- `theme-settings.mdc` — organizing `config/settings_schema.json`
- `assets.mdc` — flat directory, SVG icons need `aria-hidden="true"`
- `commit-messages.mdc` — Conventional Commits format (`feat`, `fix`, `docs`, etc.)
- Numerous `*-accessibility.mdc` files — component-specific a11y requirements (accordions, modals, carousels, forms, focus order, color contrast, etc.). Check for a matching file before building or modifying that component type.

**Note:** `liquid.mdc` and `schemas.mdc` describe an internal workflow where schemas
are authored in a `schemas/` folder (JS/TS) and compiled into `.liquid` files via
`pnpm run build:schemas`. That folder and tooling are **not present in this
checkout** — schemas here are hand-written directly inside the `{% schema %}` tag
in each `.liquid` file. Edit schemas in place.

## Working conventions

- **No comments explaining what code does** — Liquid, CSS, and JS in this repo favor self-explanatory naming; comments are reserved for non-obvious constraints.
- **BEM CSS**, scoped inside `{% stylesheet %}`/`{% style %}` tags in the same file as the markup; shared component CSS lives in `assets/*.css`.
- **Web components** for interactivity, extending `Component` from `@theme/component` (`assets/component.js`), using `ref="name"` attributes and `on:event="/methodName"` declarative bindings rather than manual `addEventListener` wiring.
- **Every string visible to a customer or merchant** needs a translation key — never hardcode English text in `.liquid` files.
- **Accessibility is not optional**: check the relevant `.cursor/rules/*-accessibility.mdc` file for the component type you're touching.

## Validating changes

There's no local build to run. Useful checks:

- `shopify theme check` — lints Liquid/JSON against Shopify's Theme Check rules (requires [Shopify CLI](https://shopify.dev/docs/storefronts/themes/tools/cli)).
- `shopify theme dev` — starts a local dev server against a connected store to preview changes.
- Manually verify any new/changed section or block renders correctly in the theme editor, including its presets and schema-driven settings.

## Reference

- [Shopify theme architecture docs](https://shopify.dev/docs/storefronts/themes/architecture)
- [Theme blocks quick start](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/quick-start?framework=liquid)
- [Liquid reference](https://shopify.dev/docs/api/liquid)
- `.cursor/rules/examples/` — worked examples of a section, two block variants, and a snippet
