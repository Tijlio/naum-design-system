# Naum Design System

React components built on Base UI and shadcn, with Tailwind CSS v4, semantic light/dark tokens, glass and mesh surfaces, and motion primitives.

The registry includes **every component in `src/components/ui`**, plus shared utilities, the mobile hook and a theme provider. `/` is a dashboard example; `/preview` shows components and interaction states. Dashboard business data and page layouts are examples, not registry components.

## Install

Use a React 19, TypeScript and Tailwind CSS v4 project initialized with shadcn. The reference configuration is `base-maia` with Base UI. Existing component files can differ: review the CLI's proposed changes before overwriting them.

Add a development registry to your project's `components.json`:

```json
{
  "registries": {
    "@naum": "https://raw.githubusercontent.com/Tijlio/naum-design-system/main/public/r/{name}.json"
  }
}
```

```sh
# Complete system, including every UI component and its dependencies.
pnpm dlx shadcn@4.23.0 add @naum/all

# Or individual components; Naum dependencies and the theme are resolved automatically.
pnpm dlx shadcn@4.23.0 add @naum/button @naum/card @naum/combobox
```

`main` is the development channel. For a released version, replace `main` in the registry URL with its published version tag. Do not use a tag until it exists. This repository does not publish or create tags automatically.

Components are copied into your project; this is not an npm component library. React and React DOM are supplied by the host project. Other registry dependencies are pinned to the versions used to build the registry.

The CLI places the shared `utils.ts` in `aliases.lib`; configure `aliases.utils` to point to that file. Directory aliases may differ from this repository (the installation check uses `@/kit/ui`, `@/shared/utils` and `@/state`).

## Set up providers and typography

See [the integration guide](docs/design-system.md#providers-and-fonts) for a complete provider example. `MotionProvider` and `TooltipProvider` wrap their consumers; `Toaster` is mounted once. Class-based dark mode uses `ThemeProvider` with `attribute="class"`.

The font token uses `--font-naum`, falling back to Plus Jakarta Sans when available and then the system font. Supply that font to reproduce the showcase typography. The registry does not download a font at runtime or impose Next.js font loading on consumers.

## Documentation

- [Component catalog](docs/components.md): every registry item and its exports.
- [Integration and component contracts](docs/design-system.md): providers, variants, forms, motion, accessibility and tokens.
- [Application showcases](docs/showcases.md): CRM, calendar, search and demo interactions.
- [Maintenance and releases](docs/maintenance.md): generation, tests, visual baselines and versioned distribution.

## Development and checks

```sh
pnpm install --frozen-lockfile
pnpm dev

pnpm check            # lint, TypeScript, unit/contract tests, generated registry parity
pnpm format:check
pnpm test:registry    # actual CLI installs in disposable consumer projects + TS/CSS checks
pnpm build:test       # isolated production build in build/next
pnpm exec playwright install chromium
pnpm test:e2e         # keyboard, focus, accessibility, responsive and visual checks
```

`pnpm registry:build` regenerates `registry.json` and `public/r/*.json` from `src/components/ui`, their imports and `src/styles/naum.css`. Do not edit generated registry files. Tests and browser reports use the ignored `build` directory; consumer fixtures are removed automatically.

CI runs the checks above. Browser coverage uses Chromium at desktop and mobile viewport sizes; it does not establish full browser or assistive-technology compatibility.
