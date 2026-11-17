# Bento and application blocks

The documentation catalog at `/docs` includes installable blocks with live previews and usage snippets:

| Registry item        | Export          | Composition                                                                      |
| -------------------- | --------------- | -------------------------------------------------------------------------------- |
| `bento-stat-card`    | `BentoStatCard` | Card, metric typography, optional trend and action, chart/content slot           |
| `bento-insight-card` | `InsightCard`   | Amber mesh Card, centered decorative illustration, action/content slots          |
| `app-navigation`     | `AppNavigation` | Shared Bento navigation variants and animated active pill                        |
| `app-shell`          | `AppShell`      | Ambient backdrop, responsive Sidebar, transparent header, navigation and content |

Use `pnpm dlx shadcn@4.23.0 add @naum/<name>` with the existing namespace configuration, or copy the full URL command from `/docs`. Blocks install under `aliases.components` with the existing nested `blocks/` and `bento/` paths. Shared dependencies stay within the Naum registry. They do not require Next.js: the consumer supplies link elements through `render` props.

The Bento dashboard and CRM use `BentoStatCard`; the CRM/calendar shell uses `AppShell`. Generic blocks accept data/actions through props and do not depend on showcase fixtures or business state. A host must configure its fonts, theme provider and TooltipProvider as described in `design-system.md`. AppShell includes MotionProvider; standalone animated blocks use the host's MotionProvider.

`AppNavigation` requires SidebarProvider. Items contain stable `id`, `label`, `icon`, `render` and optional `active`. Brand and footer content should hide secondary text for `group-data-[collapsible=icon]`. The app shell owns one main landmark; its children should use sections/headings, not another main.

Registry generation discovers block sources and registers alias-aware file targets. Clean consumer tests independently install the stat card, insight card and shell, and then the complete preset, checking TypeScript, CSS, alias rewriting and theme parity.
