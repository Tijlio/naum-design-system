# Data tables, views and follow-ups

## Shared table contracts

`DataTable<T>` renders a host-owned TanStack v8 table through Naum Card, Table, Checkbox, SelectControl and DropdownMenu. The table instance owns row IDs, row models and state. Supply stable IDs and stable data/columns; the mutable TanStack instance and its consumers intentionally opt out of React Compiler memoization (`use no memo`). The compiler lint rule may still report the upstream v8 incompatibility warning. Do not wrap the instance consumer in automatic/manual memoization without forwarding the changing state.

Column visibility preserves an identifying column in the CRM screens. `mobileHiddenColumns` keeps secondary fields out of the compact layout and column picker; contact/task editors retain those fields. Bulk operations receive the filtered selection, never hidden selected records. Loading, error/retry and empty content are explicit inputs. Sorting exposes `aria-sort`, selection is named by record and pagination is keyboard accessible.

Contacts and the pipeline's Table tab reuse the same block. The pipeline board and table share query/filter state and opportunity records; stage changes update totals, contact details and search. Tasks reuse the table and saved-view controls as a third consumer.

## Views and URLs

The generic `DataTableViews` block owns the picker and save-name dialog; its host owns snapshots and persistence. Per-scope snapshots contain search, column filters, sorting, column visibility and page size. Presets are read-only. Custom views support save, update and delete with undo. Edits retain the selected view and display “Modified” until updated.

`useWorkspaceTable` keeps validated snapshots in the `table` URL parameter and selected view IDs in `view`. Native history integration keeps typing responsive without server requests and supports refresh, copied URLs and back/forward. Identity-column visibility and filter/sort IDs are normalized for each screen. Links to contact, opportunity and task editors preserve the current view parameters. Page index and selection are transient; view changes reset both.

## Tasks and activity

`/showcase/crm/tasks` supports open, completed and overdue views, search, sorting, columns, selection, bulk completion and undo. Task editors use Naum DateTimePicker, shared controls and Dialog. Contacts and opportunities also expose context-filled task creation and completion. Changing the contact clears the opportunity selection; submission checks the relationship again. Nested task submission does not submit the opportunity form.

`workspace-actions.ts` changes records and activity together in one store update. No-op edits do not duplicate activity. Opportunity reassignment moves its tasks to the new contact; deletion removes their opportunity link while retaining the task. Deleted entities retain their activity descriptions without broken action links. The portable `ActivityTimeline` block displays caller-ordered entries; the contact projection combines notes, scheduled appointments and recorded changes, newest first.

Storage version 3 adds task and activity collections. Version 1 records and version 2 saved views migrate without losing data; new collections start empty for existing workspaces, because past activity cannot be reconstructed. Fresh/reset demos include sample tasks/history. Loading a legacy payload does not overwrite it; the next deliberate change writes the current version. Existing cross-tab/iframe synchronization and session-only fallback apply to all collections. Reset is confirmed and removes only the demo key.

## Nested navigation

`AppNavigationItem` is a leaf (`render`) or a group (`children`). Groups can nest recursively. The default `variant="collapsible"` uses Collapsible and the shared `naum-collapsible-panel` height/opacity transition. `variant="section"` keeps group labels and equal-height routes visible, without an accordion or indent; compact desktop navigation uses a keyboard-accessible DropdownMenu with descendant destinations. Mobile links close the sidebar sheet. In the collapsible variant, active descendants open their ancestry unless the user explicitly toggles the group. The showcase selects `navigationVariant="section"` on AppShell to keep route positions stable. Breadcrumbs and the CRM route tree share `workspace-routes.ts`.

Layout, page entrances and timelines reuse Naum MotionProvider, MotionLayout and MotionFadeUp. The shared motion policy honors reduced motion; no animation dependency was added.
