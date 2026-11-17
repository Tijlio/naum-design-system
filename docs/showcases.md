# Application showcases

## Routes and interactions

- `/`: Bento dashboard, centered decorative activity motifs, volumes with explicit periods, and expanding workspace search.
- `/showcase/crm`: CRM overview with derived contact/pipeline metrics, a revenue chart, upcoming conversations and contact navigation.
- `/showcase/crm/contacts`: searchable contacts with relationship filters, name sorting, paging, selection, bulk archiving, contact creation and a detail sheet with notes and relationship editing.
- `/showcase/calendar`: week, day, month and agenda views, date navigation, calendar filters and appointment creation/editing/deletion with undo. Month days open a day view; empty time slots open an appointment draft. Desktop events can be dragged to another day/time, with 15-minute snapping and undo. Timed events can be resized from either edge using a pointer or the Up/Down arrows, also in 15-minute steps. Escape cancels an active resize. Touch users can resize with the handles or move events through the appointment dialog.

The sidebar collapses to icons on desktop and opens as a sheet on mobile. Calendar defaults to the week on desktop and agenda on mobile. The mini calendar moves out of the main grid on smaller screens to preserve readable event columns.

Search is shared between Bento and the application shell. Click its icon or press Cmd/Ctrl+K. Search covers pages, contacts, deals and appointments; results support arrow keys and Enter. Escape restores focus to the search trigger. The mobile search surface uses a compact overlay. Outside clicks dismiss it.

## Data and boundaries

`ShowcaseProvider` owns the demo workspace in memory. Contacts, notes and appointments survive client navigation between these pages and appear in search immediately. Reloading the application resets the demo. There is no external CRM, calendar service or upload request.

`showcase-data.ts` provides a reproducible November 2026 demo week. Appointment strings represent local wall-clock dates/times. Timed events have an exclusive end; all-day event end dates are also exclusive internally, while the editor displays an inclusive final day. `calendar-layout.ts` clips overnight events to each visible day and allocates columns to overlapping groups.

This is a showcase scheduler, not a recurrence/time-zone engine. Recurring series and arbitrary time-zone conversion are not implemented. The layout draws on the supplied Google/iOS calendar direction and shadcn sidebar compositions; it is assembled from existing Naum controls and date-fns rather than importing a separate ReUI component tree.

## Component and motion reuse

Pages compose Naum Sidebar, Card, Table, Checkbox, InputGroup, SelectControl, DateTimePicker, Calendar, Dialog, Sheet, Avatar, Badge, Button and Sonner. Business data, actions and event placement stay outside the generic UI primitives. Showcase layout styles live in `showcase.css` and `calendar-showcase.css`; installable theme styles remain in `naum.css`.

Page entrances use `MotionFadeUp`, metric groups use `MotionStagger`/`MotionStaggerItem`, and calendar view changes use `MotionPresence`. `MotionExpand` animates search width and can also reveal height using `axis="y"`. These primitives honor `MotionProvider`'s reduced-motion policy. `CommandInput` adds an `inline` variant for the expanding field while preserving the command palette's default appearance.

## Verification

Browser coverage exercises contact creation/notes/archive, search focus and navigation, calendar views and filters, invalid event times, event CRUD and undo, all-day end dates, desktop drag/drop, pointer and keyboard resizing, and the custom date/time popup. Axe and overflow checks run in light and dark mode at desktop/mobile sizes. Screenshot baselines cover all three application pages; the visual tests fix the browser clock for reproducibility. Geometry assertions guard motif and collapsed-sidebar logo centering.

Only test sources and reviewed reference PNGs are committed. Run reports and traces remain in ignored build storage or temporary CI artifacts.
