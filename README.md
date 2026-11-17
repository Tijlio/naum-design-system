# Naum Design System

Open-source **shadcn/ui + Base UI + Tailwind CSS v4** design system with `oklch` light & dark tokens, `naum-glass-card` and `naum-mesh-*` surfaces, and `motion` micro-animations.

## Install from GitHub (`shadcn` registry)

Add the `@naum` registry to your project's `components.json`:

```json
{
  "registries": {
    "@naum": "https://raw.githubusercontent.com/Tijlio/naum-design-system/main/public/r/{name}.json"
  }
}
```

Then install the complete preset or individual components directly:

```sh
# Install everything (theme, surfaces, card, button, command, sonner, motion, ambient-backdrop)
pnpm dlx shadcn@latest add @naum/all

# Or install individual items
pnpm dlx shadcn@latest add @naum/theme @naum/card @naum/button @naum/motion @naum/ambient-backdrop
```

Or install directly by URL without editing `components.json`:

```sh
pnpm dlx shadcn@latest add https://raw.githubusercontent.com/Tijlio/naum-design-system/main/public/r/all.json
```

## Available Registry Items

- `all` — Complete preset (installs `theme` + all Naum components below)
- `theme` — `oklch` light/dark tokens (`--radius: 0.625rem`, `--surface-frosted`, `--glass-*`) + `naum-glass-card` & `naum-mesh-*` utilities
- `card` — `Card` with `default`, `glass`, `frosted` and `mesh` variants
- `button` — `Button` with `glass` and `glow` variants, `cursor-pointer` and tactile press
- `command` — `Command` & `CommandDialog` (`rounded-3xl`, clean borderless search header)
- `sonner` — Frosted glass `Toaster` with readable descriptions
- `ambient-backdrop` — Subtle `fixed` ambient glow layer for glass cards
- `motion` — `MotionProvider`, `MotionFadeUp`, `MotionStagger`, `MotionDrawPath`, `MotionPill`

## Local Development

```sh
pnpm install
pnpm dev
```

- `/` — Bento dashboard showcase
- `/preview` — Full component preview with Light/Dark toggle, Sonner & `⌘K` Command Palette
- `pnpm registry:build` — Rebuilds `public/r/*.json` from `registry.json`
