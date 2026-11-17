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

Final run: 29 unit/contract tests passed; 89 browser tests passed and one desktop drag/drop test was deliberately skipped in the mobile project. Both clean-consumer registry installs passed. Build, lint, TypeScript, formatting and registry parity passed.

Browser reports/traces remain ignored locally and are uploaded by CI as temporary artifacts. Only test sources and reviewed reference images are committed.

## Limits

The workspace remains an in-memory demonstration. Native desktop drag/drop is deliberately skipped in the mobile project, where the appointment editor is tested as the move alternative. Mobile coverage uses Chromium's responsive/touch emulation; it is not a real-device or cross-browser certification. Screenshots and axe checks do not constitute a complete screen-reader or WCAG certification, including contrast over mesh gradients.
