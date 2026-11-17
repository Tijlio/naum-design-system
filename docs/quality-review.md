# Visual and code quality review

Reviewed 17 November 2026 against the current Bento implementation. Changes were made in the existing checkout, using the existing Naum components and pnpm lockfile.

## Reviewed flows

| Step | Surface and states                                       | Result after corrections                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1    | Bento and component preview, light/dark, desktop/mobile  | Shared title typography; existing Card, form-control, mesh and popup styles retained.                                                                                                                                                                                                                                                                                                                                          |
| 2    | CRM overview, metrics, opportunities and recent contacts | Mobile opportunity titles and values fit; stages remain visible below titles. Metrics share one data projection, and their trend indicators reuse the Bento component with calculated demo-baseline comparisons. Upcoming appointments and recent contacts are sorted by their actual dates.                                                                                                                                   |
| 3    | Contacts, filtering, empty state and detail sheet        | Table columns adapt to the available width. Owner, last-contact date and value remain available in details. Avatars and deal-stage badges are shared across list, overview and details.                                                                                                                                                                                                                                        |
| 4    | Contact/appointment forms and date/time popup            | Dialogs use one opaque surface without a nested white field card. Menu backgrounds are opaque. Shared controls, validation, focus and viewport limits checked. Form actions remain reachable at 320 × 640.                                                                                                                                                                                                                     |
| 5    | Calendar week/day/month/agenda, move and resize          | The dark left accent on appointments is removed. Compact month labels stay on one line. Layout and resize previews share clipped bounds. Quarter-hour cards use separate lanes where their minimum rendered heights would overlap; cards stop at the visible day boundary.                                                                                                                                                     |
| 6    | Sidebar, expanding search and app header                 | Header is transparent and has no separating border/blur. The app has one main landmark. Sidebar styling is forwarded on mobile. Bento and app navigation share border/background variants, including 40px centered collapsed items. The search result list stays outside the animated input clipping boundary. Search restores focus and clears its query on shortcut dismissal; duplicate titles have independent result IDs. |

The review includes current browser screenshots, keyboard interactions, responsive overflow checks and axe checks for the covered component/application flows. Before/after captures are retained locally under `build/visual-audit`; reviewed regression references are in `tests/e2e/snapshots`. Passing visual tests also attach fresh captures to the browser report.

## Code changes and responsibilities

- `naum-page-title` in the installable theme owns page-heading typography. Screens compose existing Card variants rather than duplicating their surfaces.
- `navigationItemVariants` and `BentoMetricTrend` share the Bento/app navigation and trend presentation rules. `ContactAvatar` and `DealStageBadge` contain repeated CRM presentation rules; domain-specific styling stays outside generic UI primitives.
- `crm-overview-data.ts` derives screen data without mutating workspace records. Aggregates are calculated once and shared with chart breakdowns.
- `money-format.ts` owns the currency formatter and uses `Intl.NumberFormat.formatToParts`. `BentoMetricValue` only renders the supplied parts.
- `getEventDayBounds` owns event clipping and minimum display size. Time-grid placement and resize previews use that same calculation.
- Search dismissal has one focus/reset path, with a cleaned-up keyboard subscription. Search identity is separate from the displayed title.
- Sidebar's public `className` contract now applies to its mobile surface as well as its desktop variants.

No runtime dependency was added. No migration, backend integration or persistence was introduced.

## Validation

- `pnpm check`: lint, strict TypeScript, unit/contract tests and generated-registry parity.
- `pnpm format:check` and `git diff --check`.
- `pnpm test:registry`: real CLI installs of `command` and `all`, including consumer TypeScript, CSS, aliases and theme parity.
- `pnpm build:test` and the full desktop/mobile browser suite, including screenshots, axe, reduced motion, contacts, search, calendar CRUD and drag/resize.

Latest feature pass: 50 unit/contract tests passed; 128 browser tests passed and two desktop drag/drop tests were deliberately skipped in the mobile project. Eight clean-consumer registry installs passed (command, activity timeline, DataTable, view controls, app shell, stat card, insight card and complete preset). Build, lint, TypeScript, formatting and registry parity passed.

Browser reports/traces remain ignored locally and are uploaded by CI as temporary artifacts. Only test sources and reviewed reference images are committed.

## Limits

The workspace remains a local demonstration with validated, versioned browser persistence; it has no server or account synchronization. Native desktop drag/drop is deliberately skipped in the mobile project, where the appointment editor and per-card pipeline selector are tested as move alternatives. Mobile coverage uses Chromium's responsive/touch emulation; it is not a real-device or cross-browser certification. Screenshots and axe checks do not constitute a complete screen-reader or WCAG certification, including contrast over mesh gradients.

## Documentation and workspace additions

The follow-up pass covers the `/docs` catalog, live variant/state examples, install/copy commands and typed source API load/retry; portable Bento/app blocks with alias-aware installs; validated local storage, refresh, cross-tab/iframe synchronization and confirmed reset; and the four-stage CRM pipeline. Pipeline coverage exercises create/edit, desktop dragging, keyboard/touch selection, per-stage totals, search deep links, overview metric updates, persistence, delete/undo, both themes and 320px form actions. The shared app shell now includes a compact content transition with the breadcrumb in the topbar. Runtime console/page errors are checked on the production pipeline pages.

## Data table, follow-up and navigation pass

Contacts, opportunity tables and tasks now share DataTable and saved-view controls. Coverage checks URL normalization, filter combinations, sorting, visibility, stable selection, pagination, bulk updates, saved-view update/delete/undo and back/forward restoration. Task coverage includes deadlines, context-filled creation, nested-dialog isolation, completion/deletion/undo, persistent activity, deleted/reassigned opportunity links and legacy storage migration. The timeline keeps insertion order when event timestamps match and avoids inventing times for date-only notes. Overdue status remains visible on mobile.

Nested CRM routes are checked expanded, collapsed, on mobile and with keyboard activation. Fresh screenshots cover tasks and the visible contact timeline in both themes, alongside the existing application/primitive scenes. The shared Select primitive constrains long labels; the documentation tests a long saved-view name without horizontal overflow.

ESLint reports zero errors and three known `react-hooks/incompatible-library` warnings from TanStack v8's mutable `useReactTable` instance (documentation, application adapter and test fixture). The relevant functions and instance renderer use `use no memo`; the compiler compatibility contract is documented in [data-tables-and-follow-ups.md](data-tables-and-follow-ups.md). No lint rule or test was disabled to accept these warnings.
