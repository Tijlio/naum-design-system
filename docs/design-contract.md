# Naum design contract

Naum uses the Bento showcase as its visual reference. This contract governs the shared components and the application: screens choose variants and composition; the theme owns their appearance. Domain labels, data, state and validation stay in the application.

## Sources of truth

| Concern                                           | Source                                                        | Rule                                                                                         |
| ------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Semantic colors, tones, spacing, surfaces, motion | `src/styles/naum.css`                                         | Edit here and run `pnpm registry:build`. Values ship in the installable theme.               |
| Component variants                                | `src/components/ui/*` and `src/components/blocks/*`           | Add a variant for an existing repeated need; keep page-specific layout outside primitives.   |
| Motion numeric defaults                           | `src/lib/motion-tokens.ts`                                    | Generated from CSS, in seconds for Motion. Never edit this file manually.                    |
| Application composition                           | `src/styles/showcase.css`, `src/styles/calendar-showcase.css` | Layout and domain mappings only; reuse shared tokens rather than adding palettes or timings. |

The registry generator produces the Motion module and its installable payload from the same CSS values. `pnpm registry:check` detects stale generated source as well as stale registry payloads. No runtime DOM lookup is needed, including during SSR.

## Color and tone

Use `foreground` / `muted-foreground` for ordinary and secondary copy. `primary` is an action color, `destructive` marks destructive/error actions, and `chart-*` identifies data series. Do not use chart colors as an alternative application palette. Bento trend icons and labels use the shared `--trend-up`, `--trend-down` and paired soft/copy tokens.

Lavender, mint and amber each have `--tone-<name>-background`, `foreground` and `accent` tokens. The first two form a light/dark contrast pair for soft surfaces; the accent is for decorative washes. A tone does not communicate status by itself: retain a text label or icon. Calendar names and pipeline stages map to tones in their domain modules.

Use `Badge variant="soft" tone="mint"` for compact tinted labels, `AvatarFallback variant="soft" tone="lavender"` for identities, and the `naum-tone` / `naum-tone-fill` utilities for existing compositions that need the same palette. `data-tone` selects lavender, mint or amber; lavender is the default. `Checkbox tone` uses the same fill/check contrast pair while retaining a visible unchecked/focus state. `Card tone` sets the palette for a decorative wash without changing its surface variant.

## Spacing

Keep Tailwind's 4px spacing scale for local geometry. Use named roles at repeated boundaries:

| Token                                          | Default     | Owner                                    |
| ---------------------------------------------- | ----------- | ---------------------------------------- |
| `--naum-space-page`                            | 24px        | AppPage and workspace section stacks     |
| `--naum-space-section`                         | 16px        | Form rows and content groups             |
| `--naum-space-control`                         | 12px        | PageToolbar and wrapping control groups  |
| `--naum-space-inline`                          | 8px         | Related actions and checkbox-label pairs |
| `--naum-space-field`                           | 8px         | Label to control                         |
| `--naum-inset-panel`                           | 24px        | Default Card and inset toolbar           |
| `--naum-inset-compact`                         | 16px        | Compact Card                             |
| `--naum-inset-page` / `--naum-inset-page-wide` | 20px / 32px | Mobile / desktop app gutter              |

AppPage owns the page gap and entrance. PageHeader owns the title/actions arrangement; PageToolbar owns wrapping controls. SearchInput owns the standard query control. Do not add compensating margins to align separate screen implementations. Responsive wrapping must retain logical DOM and keyboard order.

## Surfaces

| Variant / utility                       | Use                                                                         |
| --------------------------------------- | --------------------------------------------------------------------------- |
| Card `default` / `naum-surface-card`    | Primary content: shared radius, card fill, subtle outline and shadow        |
| Card `frosted` / `naum-surface-frosted` | Grouping content over the ambient background                                |
| Card `glass` / `naum-glass-card`        | Deliberate decorative glass treatment; check composited contrast            |
| Card `mesh` + `naum-mesh-*`             | Bento highlight; keep white copy and contrasting mesh actions               |
| `naum-popup-surface`                    | Opaque menus/selects/popovers with shared highlight and separator treatment |
| `naum-app-overlay`                      | Dialog or sheet treatment that carries the ambient tint on an opaque base   |
| `naum-active-pill`                      | The same active navigation surface at all route depths                      |

Do not make menus translucent. Preserve focus rings even on visually borderless controls. Surface elevation is owned by its variant, not repeated ring/shadow strings in screens. Keep transparent app chrome above AmbientBackdrop; place content in the shell's stacking context.

## Motion

| Role     | Default | Use                                              |
| -------- | ------- | ------------------------------------------------ |
| `fast`   | 150ms   | Control feedback, popup fade/scale               |
| `hover`  | 200ms   | Small icon movement and card lift                |
| `layout` | 220ms   | Expansion and layout movement                    |
| `normal` | 300ms   | Sheet/collapsible transitions and glass feedback |
| `enter`  | 350ms   | Loaded page entrance                             |
| `draw`   | 750ms   | Decorative SVG drawing                           |

`--ease-naum` is the common exit easing. Stagger delay (45ms), draw delay (150ms), entrance offset (12px) and active-pill spring (420 stiffness, 34 damping) are also generated into `motionTokens`.

Use the shared Motion primitives and one AppPage entrance per page. Navigation moves one active pill per instance. Flyouts scale from their anchor; they do not switch slide direction according to placement. Calendar view changes fade at y=0. Preserve native drag physics and library-owned drawer swipe calculations instead of replacing them with a page animation.

MotionProvider honors the user's reduced-motion preference. CSS transitions/animations also honor that preference; movement on hover/press is guarded. Explicit Motion overrides must preserve that policy. Source-level CSS token edits regenerate Motion defaults; runtime CSS overrides alone do not change already compiled numeric Motion transitions. Consumers can override a transition explicitly when needed.

## Review and validation

For a new screen, check desktop/mobile and light/dark, opened overlays, empty and invalid states, keyboard/focus behavior and reduced motion. Run the narrow affected tests first, then `pnpm check`; changes to installable primitives require clean-consumer checks. Deliberate visual differences need reviewed screenshot baselines. Local test reports stay in ignored build storage; reviewed baseline PNGs belong in Git.
