# Customer workflow

The demo supports contact → opportunity → task → appointment without reselecting the same relationship at each step. It uses the shared Naum controls, surfaces and motion contract.

## Navigation and context

Create a contact and use the “View contact” toast action to open its details. “New opportunity” carries that contact into the opportunity editor. Saved opportunities have contextual task creation. A saved task offers “Schedule appointment”, carrying its contact, opportunity, title and due date into the appointment editor; long task titles are shortened to fit the appointment title limit. Scheduling does not complete the task automatically.

Related-record links navigate back to the contact, opportunity or task. Contact, opportunity and task details list matching appointments. Existing records also remain reachable through workspace search and the contact timeline. Missing URL targets show a recovery action rather than silently opening a blank create form. Closing a missing record preserves unrelated table/view query parameters.

The calendar derives the visible week from a linked appointment even when its local data arrives after hydration. It keeps that date when the editor closes. Appointment contact changes clear incompatible opportunity/task choices; opportunity changes clear the task choice. An explicit “No opportunity” or “No task” is distinct from an invalid/missing selection.

## Form behavior

`forms/use-workspace-form.ts` owns native constraint validation, associated field errors, focus recovery, the submit lock and draft dismissal. Domain validation lives in `workspace-validation.ts` and also runs inside record mutation functions; stale relationships cannot be persisted by an older form closure. Shared errors use Naum motion and honor reduced motion. Modal launchers supply Base UI final-focus targets; URL-driven editors retain their opener and fall back to the page action when it is no longer present. Discard confirmation returns focus to the editor when editing continues, and lets the closing editor restore focus when changes are discarded.

A validation or unexpected save failure retains the draft and permits retry. Successful submissions close the editor; notes reset their field and remain in the contact sheet. Cancel, Escape, close and related-record navigation request confirmation after edits. “Keep editing” retains the draft; “Discard changes” leaves without persisting it. Refresh uses the browser's native unsaved-changes prompt. These are in-memory drafts, not autosaved drafts that survive an accepted reload.

Native and domain validation are deliberately complementary: input constraints prevent invalid values, while domain validation also covers whitespace-only titles, date ordering, contact membership and cross-record relationships. Selection controls never substitute the first contact for a stale explicit relationship. New records cannot be started from an archived contact; existing archived relationships remain viewable/editable.

## Persistence and recovery

Appointments optionally store `contactId`, `dealId` and `taskId`. Tasks retain their existing contact and optional opportunity. A linked task and its appointment must refer to the same contact and opportunity.

Storage version 4 accepts versions 1–3. Version 3 tasks and activity history are retained; older versions migrate without those collections. No user storage is rewritten merely by reading it. New mutations write the current format. Invalid/future data retains the existing session-only fallback and explicit demo reset behavior.

Opportunity contact changes update its tasks and linked appointments atomically. Task contact/opportunity changes update its linked appointments. Deleting an opportunity detaches that optional link; deleting a task detaches its appointment link. Appointments retain their other valid context.

Deletion actions return an undo receipt captured before mutation. Undo restores detached relationships against current data rather than replacing the entire workspace, preserving intervening edits. Undo actions validate current relationships and show an error if they can no longer be restored. Restore events appear in contact history. Local storage and cross-tab synchronization remain the demo's persistence boundary; no backend is introduced.

## Validation

Unit coverage checks relationship invariants, version-three migration, atomic deletion/undo, draft retention, associated errors and focus, submission deduplication and repeat note submissions. Browser coverage runs the entire chain in light/dark mode on desktop/mobile, reloads a linked appointment in a later month, tests reverse navigation and undo, checks missing links, verifies cross-tab deletion recovery, and checks validation/discard behavior and accessibility.
