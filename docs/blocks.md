# Bento and application blocks

The documentation catalog at `/docs` includes installable blocks with live previews and usage snippets:

| Registry item        | Export          | Composition                                                                      |
| -------------------- | --------------- | -------------------------------------------------------------------------------- |
| `bento-stat-card`    | `BentoStatCard` | Card, metric typography, optional trend and action, chart/content slot           |
| `bento-insight-card` | `InsightCard`   | Amber mesh Card, centered decorative illustration, action/content slots          |
| `app-navigation`     | `AppNavigation` | Shared Bento navigation variants and animated active pill                        |
| `app-page`           | `AppPage`       | Loaded-page motion, minimum width and shared vertical rhythm                     |
| `page-header`        | `PageHeader`    | Eyebrow, one h1, optional count and primary actions                              |
| `page-toolbar`       | `PageToolbar`   | Responsive controls/actions slots and shared inset padding                       |
| `app-shell`          | `AppShell`      | Ambient backdrop, responsive Sidebar, transparent header, navigation and content |

Use `pnpm dlx shadcn@4.23.0 add @naum/<name>` with the existing namespace configuration, or copy the full URL command from `/docs`. Blocks install under `aliases.components` with the existing nested `blocks/` and `bento/` paths. Shared dependencies stay within the Naum registry. They do not require Next.js: the consumer supplies link elements through `render` props.

The Bento dashboard and CRM use `BentoStatCard`; the CRM/calendar shell uses `AppShell`. Generic blocks accept data/actions through props and do not depend on showcase fixtures or business state. A host must configure its fonts, theme provider and TooltipProvider as described in `design-system.md`. AppShell includes MotionProvider; standalone animated blocks use the host's MotionProvider.

`AppNavigation` requires SidebarProvider. Leaf items contain stable `id`, `label`, `icon`, `render` and optional `active`. Groups use `children` instead of `render`; active descendants, recursive expansion and compact flyout menus are supported. Brand and footer content should hide secondary text for `group-data-[collapsible=icon]`. The app shell owns one main landmark; its children should use sections/headings, not another main.

Registry generation discovers block sources and registers alias-aware file targets. Clean consumer tests independently install the stat card, insight card and shell, and then the complete preset, checking TypeScript, CSS, alias rewriting and theme parity.

## Data tables and saved views

`data-table` installs `DataTable<T>`, a presentation block for a host-owned TanStack v8 table. Supply stable record IDs, the appropriate row models and typed column definitions. It supports sortable/grouped headers, visibility controls, page selection, pagination, bulk-action slots and loading/error/empty states. `mobileHiddenColumns` omits secondary fields from compact tables and their column picker; detail views should keep those fields accessible. Bulk actions receive only selected records that match the current filter. The block does not fetch, persist or interpret domain data.

`data-table-views` installs the saved-view picker and save-name dialog. The host owns snapshots, URL integration and storage. Read-only presets cannot be changed or deleted. `data-table-view` supplies the serializable state type and runtime guard. Live examples in `/docs` demonstrate sorting, selection, filtering, loading/retry and named views.

`activity-timeline` installs the portable `ActivityTimeline` and `TimelineEntry` contract. The host owns chronological ordering, date formatting, icons and optional actions. CRM contact history is one consumer. [Table, view and follow-up integration](data-tables-and-follow-ups.md) documents the application contracts.

`AppNavigation` accepts `variant="collapsible"` (default) or `variant="section"`. Sections keep route groups visible and aligned; compact desktop groups expose the same descendants through a flyout. `AppShell` forwards the choice through `navigationVariant`. The playground in `/docs` demonstrates both styles.

One scoped active pill moves across navigation depths, with visible overflow so the shared layout animation can travel between buttons. A collapsed active accordion group retains its indicator. Compact flyouts use the same active/inactive surfaces and anchor-based opacity/scale transition, without directional slides. MotionProvider and the theme honor reduced motion.

## Shared page composition

Compose `AppPage`, `PageHeader` and `PageToolbar` inside AppShell. AppPage uses the existing MotionFadeUp and a shared 24px vertical gap; it supplies no extra main landmark. Mount it with the loaded view and keep it mounted for query/filter updates. Standalone usage needs MotionProvider. PageHeader accepts a string `title`, optional `eyebrow`, numeric `count` (including zero) and `actions`. The header owns count presentation; the application owns whether that number represents active records, open tasks or all opportunities.

PageToolbar accepts controls as `children` and trailing `actions`. It uses a named group and normal tab order, rather than imposing toolbar arrow-key behavior. Supply an `aria-label` describing the controls. The default `variant="plain"` adds no padding; `variant="inset"` provides 24px card padding. Controls and actions share 12px gaps, with full-width search on compact screens and other controls/actions wrapping naturally. DataTable reuses the inset toolbar and leaves page entrance animation to its host.

`search-input` is a UI primitive composed from InputGroup, Label and InputGroupInput. Its required `label` supplies an associated accessible name. It uses native search semantics, a shared Search icon and the same 36px height as shared inputs. Input props, refs and form `name` are forwarded; `className` styles the outer group. Disabled, read-only, invalid and described-by behavior remains in the shared controls. Native browser cancel decoration is hidden to preserve Naum styling. Command palettes and comboboxes keep their specialized keyboard/search contracts.

The four catalog entries share a working composition playground and an additional command that installs every component used by the snippet. Preview state remains local to documentation. Clean-consumer checks install each new item independently, as well as the complete preset, with custom aliases, TypeScript and Tailwind compilation.
