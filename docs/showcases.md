# Application showcases

## Routes and interactions

- `/`: Bento dashboard, centered decorative activity motifs, volumes with explicit periods, and expanding workspace search.
- `/showcase/crm`: CRM overview with derived contact/pipeline metrics, a revenue chart, upcoming conversations and contact navigation.
- `/showcase/crm/pipeline`: four-stage opportunity board with per-stage counts and values, title/contact/company search, creation/editing, stage moves, deletion and undo. Desktop cards can be dragged across stages; each card also offers a shared SelectControl for keyboard/touch movement. Moves update overview metrics, contact details and workspace search, and survive refresh. Search and overview links open the opportunity editor through `?deal=<id>`.
- `/showcase/crm/tasks`: reusable follow-up table with saved open/completed/overdue views, deadlines, create/edit/delete, completion, bulk completion, undo and search deep links. Contacts/opportunities expose contextual task creation; contact timelines merge notes, scheduled appointments and recorded changes.
- `/showcase/crm/contacts`: searchable contacts with relationship filters, name sorting, paging, selection, bulk archiving, contact creation and a detail sheet with notes and relationship editing.
- `/showcase/calendar`: week, day, month and agenda views, date navigation, calendar filters and appointment creation/editing/deletion with undo. Month days open a day view; empty time slots open an appointment draft. Desktop events can be dragged to another day/time, with 15-minute snapping and undo. Timed events can be resized from either edge using a pointer or the Up/Down arrows, also in 15-minute steps. Escape cancels an active resize. Touch users can resize with the handles or move events through the appointment dialog.

The application shell reuses Bento’s indigo/cyan ambient backdrop, translucent surfaces and animated active navigation pill. CRM metrics use the same default Card surface, muted labels and shared BentoMetricValue typography as Bento KPI cards. Their small charts show current workspace breakdowns, not historical trends. The appointment metric reuses Bento’s amber InsightCard, including its illustration and white text. Contact totals use a compact Badge beside the title.

The app header is transparent, without a dividing line or backdrop blur. Its breadcrumb shares the top row with the sidebar trigger and actions; the parent crumb is hidden on compact screens. Shared AppShell content padding keeps the transition to page headings compact. Page titles share the theme’s `naum-page-title` utility with Bento and preview. Contact avatars and opportunity-stage badges use shared domain components. Navigation variants and trend circles are reused directly from Bento; comparison arrows derive from the explicit `CRM_COMPARISON` demo snapshot. On small screens, tables wrap opportunity names and show secondary contact information in the detail sheet.

The sidebar collapses to icons on desktop and opens as a sheet on mobile. Calendar defaults to the week on desktop and agenda on mobile. The mini calendar moves out of the main grid on smaller screens to preserve readable event columns.

Search is shared between Bento and the application shell. Click its icon or press Cmd/Ctrl+K. Search covers pages, contacts, deals and appointments; results support arrow keys and Enter. Escape restores focus to the search trigger. The mobile search surface uses a compact overlay. Outside clicks dismiss it. The expanding search surface floats above the layout so opening it cannot wrap the header or move page content.

## Data and boundaries

`ShowcaseProvider` owns a versioned local demo workspace. Contacts, notes, appointments and opportunities survive navigation and refresh in the same browser. Storage events synchronize validated updates and resets between open tabs and the documentation iframe; concurrent edits use the latest stored workspace. Loaded records are validated before use; malformed or incompatible data falls back to the original fixtures without crashing. If storage is unavailable, interactions remain usable for the current session and the header shows “Session only”. The reset action asks for confirmation and removes only `naum-demo-workspace`, preserving theme settings and other browser data. There is no external CRM, calendar service or upload request.

`showcase-data.ts` provides a reproducible November 2026 demo week. Appointment strings represent local wall-clock dates/times. Timed events have an exclusive end; all-day event end dates are also exclusive internally, while the editor displays an inclusive final day. `calendar-layout.ts` clips overnight events to each visible day and allocates columns to overlapping groups.

This is a showcase scheduler, not a recurrence/time-zone engine. Recurring series and arbitrary time-zone conversion are not implemented. The layout draws on the supplied Google/iOS calendar direction and shadcn sidebar compositions; it is assembled from existing Naum controls and date-fns rather than importing a separate ReUI component tree.

## Component and motion reuse

Pages compose Naum Sidebar, Card, Table, Checkbox, InputGroup, SelectControl, DateTimePicker, Calendar, Dialog, Sheet, Avatar, Badge, Button and Sonner. Business data, actions and event placement stay outside the generic UI primitives. Contact details use an indigo mesh header with white text above default Card sections. Contact and appointment dialogs share `workspace-dialog` layout rules, including viewport height limits for small screens. Dialogs use the primitive’s single opaque surface; the colored background remains on the page and detail sheet. Calendar controls use a frosted Card; appointment chips share Card shadows and radii with calendar color accents.

Showcase layout styles live in `showcase.css` and `calendar-showcase.css`; installable theme styles remain in `naum.css`.

Pipeline card transitions use the shared `MotionLayout`, which disables layout IDs and movement for reduced motion. Page entrances use `MotionFadeUp`, metric groups use `MotionStagger`/`MotionStaggerItem`, and calendar view changes use `MotionPresence`. `MotionExpand` animates search width and can also reveal height using `axis="y"`. These primitives honor `MotionProvider`'s reduced-motion policy. `CommandInput` adds an `inline` variant for the expanding field while preserving the command palette's default appearance.

## Verification

Browser coverage exercises contact creation/notes/archive, search focus and navigation, calendar views and filters, invalid event times, event CRUD and undo, all-day end dates, desktop drag/drop, pointer and keyboard resizing, and the custom date/time popup. Axe and overflow checks run in light and dark mode at desktop/mobile sizes. Screenshot baselines cover all three application pages, contact details, contact/appointment forms and the month calendar; the visual tests fix the browser clock for reproducibility. Geometry assertions guard motif and collapsed-sidebar logo centering.

The latest cross-app review is documented in [quality-review.md](quality-review.md).

Only test sources and reviewed reference PNGs are committed. Run reports and traces remain in ignored build storage or temporary CI artifacts.

Contacts, pipeline tables and tasks share the installable DataTable and view controls. Views persist locally and in validated URL state. CRM routes share a fixed labeled section in expanded/mobile navigation and flyout destinations in the compact sidebar. The installable navigation also retains an optional collapsible variant. See [data-tables-and-follow-ups.md](data-tables-and-follow-ups.md) for migrations and contracts.

## Shared page composition

Overview, Contacts, Tasks, Pipeline (board and table) and Calendar use AppPage and PageHeader. View controls, DataTable filters/actions and calendar date/view navigation use PageToolbar. Ordinary query fields use SearchInput; command search and comboboxes keep their own interaction behavior. Header counts are application-owned totals (active contacts, open tasks and all opportunities). The board only adds a matching-result badge when filtering changes the result count. The shared page root stays mounted during query-only changes; generic tables no longer add a second vertical entrance.

PageToolbar lays out controls and trailing actions in a single wrapping row, so full-width mobile search can be followed by filters/actions without an empty grouping row. Saved-view groups can shrink inside that toolbar, including long user-defined names. Existing dialogs and detail sheets retain their own semantic headers rather than adding nested page headings. Page-specific data, validation, URL state, saved views and local persistence remain in the showcase layer.
