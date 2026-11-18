# Changelog

## Unreleased

- Complete the contextual contact → opportunity → task → appointment workflow, with related-record navigation, linked appointment lists and correct calendar dates after hydration/reload.
- Share form validation, field errors, focus recovery, draft-discard confirmation and submission deduplication; preserve failed drafts and reset successful note submissions in place.
- Add optional opportunity/task appointment links with version-four demo storage migration; keep relationships consistent during edits, deletions and undo without replacing later workspace changes.
- Distinguish explicit empty SelectControl options from placeholders and offer recovery for missing record URLs.

- Reuse shared surface/tone variants and spacing across page composition, forms, badges, avatars, calendar filters/events and navigation. Align CSS and Motion timing, preserve reduced motion and opaque popups, and remove application palette duplication.
- Establish a shared design contract for semantic tones, spacing, surfaces and motion. Generate typed Motion defaults from the CSS source and distribute them with the registry.

- Add installable DataTable, saved-view controls and ActivityTimeline blocks with live documentation and clean-consumer coverage.
- Reuse tables across contacts, opportunity list/board and tasks, with shareable URL state, saved views, filters, columns, bulk actions and history navigation.
- Add persisted contextual follow-ups and atomic activity history, with migration from earlier demo storage versions and undo for task actions.
- Nest CRM navigation with animated expansion, compact flyouts and breadcrumbs derived from the shared route tree.

- Add interactive documentation with registry installation commands, live component/block examples and typed source references with retry/copy recovery.
- Publish portable BentoStatCard, InsightCard, AppNavigation and AppShell blocks; reuse them in Bento and CRM and verify clean consumer installs.
- Persist validated, versioned demo contacts, notes, appointments and opportunities in local storage, with a confirmed reset scoped to the demo key and session-only fallback.
- Add the searchable CRM pipeline with opportunity creation/editing, stage totals, desktop drag/drop, keyboard/touch move controls, delete/undo and live metrics/search integration.
- Put workspace breadcrumbs in the transparent app topbar, reduce page-heading spacing and add reusable reduced-motion-aware layout transitions.

- Make popup menus opaque, flatten form dialogs to one surface, and share Bento navigation borders/sizing and metric trend indicators across the application. Keep search results outside the animated input clipping boundary.

- Complete a cross-app visual/code quality pass: transparent header, shared page typography, responsive tables, consistent contact avatars/stages, accessible search dismissal and stable result identity.
- Separate CRM projections and currency formatting from rendering; share calendar bounds and prevent short appointment cards from visually overlapping or exceeding a day.
- Forward mobile Sidebar styling and retain fresh screenshot evidence alongside expanded regression coverage.

- Reuse Bento KPI typography, default Card surfaces and the amber InsightCard in CRM; extend the same surfaces to contact details, forms and calendar controls/events. Cover opened panels and forms with light/dark browser and screenshot checks.

- Carry Bento mesh cards, glass surfaces, ambient depth and animated sidebar navigation into the application showcase. Keep contact totals compact, search out of document flow, and resize grips inside appointment cards.

- Add shared Naum date/time and select controls; replace browser-native showcase pickers.
- Resize timed appointments by pointer or keyboard, with 15-minute snapping, cancellation and undo.

- Add CRM overview, interactive contacts and a week/day/month/agenda calendar showcase with shared in-memory data.
- Add expanding workspace search, `MotionExpand`/`MotionPresence` and an inline CommandInput variant.
- Simplify activity statistics, clarify their periods and center decorative motifs.
- Cover showcase interactions, calendar event layout, accessibility and responsive presentations with tests.

- Distribute all 59 UI components, the theme provider, mobile hook and shared utilities through the Naum registry.
- Generate the theme and component catalog from their sources. Resolve component dependencies within Naum and pin installed npm dependency versions.
- Add a configurable registry ref and a manual, versioned release preparation workflow. `main` is the development channel.
- Share popup surfaces, shadows, CSS easing/durations and card hover styling. Preserve destructive menu-item styling.
- Improve light-theme muted/destructive text contrast, accessible labels, select display labels, scroll-region keyboard access and mobile preview wrapping.
- Clean up both carousel subscriptions and make sidebar skeleton widths deterministic for SSR.
- Forward motion element props and honor configured reduced motion, including SVG paths and showcase chart series.
- Support scalar slider values, per-thumb accessible names and SSR thumb indices.
- Preserve Toaster defaults when consumers extend icons, styles and toast class names.
- Add unit/contract tests, real consumer-install checks, browser/axe/visual checks and CI. Document integration contracts and release maintenance.

### Consumer notes

Regenerate and reinstall component sources deliberately; registry changes do not update copied components automatically. Existing theme tokens, popup animation behavior and muted/destructive colors change. Configure the shared `utils.ts` location consistently in `components.json`. Load Plus Jakarta Sans and set `--font-naum` for showcase typography. No release tag has been created by these changes.
