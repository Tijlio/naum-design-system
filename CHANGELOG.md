# Changelog

## Unreleased

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
