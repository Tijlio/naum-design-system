# Interactive documentation

Open `/docs` from the component preview or workspace search. The catalog is derived from `registry.json`; each UI component has an installation command and a link to its complete source/types. Copy commands use full registry URLs, so namespace configuration is optional.

Button, Card, Input, Badge, SelectControl, Motion, Dialog, Sheet, DateTimePicker, Combobox and SearchInput have interactive examples with usage code and API/accessibility notes. All other primitives load their typed source API directly from the generated registry, with loading, error and retry states, and link to the existing component preview. Bento/app blocks, DataTable, saved-view controls and the activity timeline have live previews and usage snippets, including loading/error/retry and empty states. Changing the selected component resets its playground state. Light/dark styles and responsive controls reuse Naum.

The catalog metadata is generated; examples live in `src/components/docs` and should be updated when their public contracts change. These examples execute normal React components; they do not evaluate user-supplied code.

## Overlay examples

Dialog and Sheet share deterministic ready/loading/error/empty scenarios with Naum Skeleton, Alert, Empty and MotionFadeUp. Change Content state inside the open modal to try recovery without leaving its focus boundary. The ready form validates its name, saves locally to the example and restores trigger focus when closed. Show close button and all four Sheet sides update the copied usage code. Escape and Cancel remain available when the close icon is hidden. State handling belongs to the example form; it does not add request-state props to the primitives.

## Picker examples

DateTimePicker demonstrates controlled local dates and times, date-only mode, disabled controls, clearing an empty value, loading and host-form validation. The error scenario requires 17 November 2026 or later: select a valid day or use the recovery action. This is an example policy, not a date constraint in the primitive. Values remain local `yyyy-MM-ddTHH:mm` strings without timezone conversion.

Combobox demonstrates separate selection and query state, keyboard navigation, clearing, filtered no-results and ready/loading/error/empty datasets. Its searchable popup keeps the input and recovery actions together, outside the listbox. `modal` and `aria-modal` identify the modal popup, keep keyboard focus within it and restore trigger focus when dismissed. Disabled mode applies to the shared controls. Recovery actions use fixture data; these examples do not make network requests or alter the CRM workspace.

The usage snippets are complete example components for the selected scenario. Wrap them in Naum's `MotionProvider` to honor system reduced-motion preferences (the documentation already supplies it). A contract test typechecks all 64 state/variant combinations against the real shared component exports. Browser tests cover recovery, validation, keyboard interaction, focus restoration, all four Sheet sides, both themes and desktop/mobile layouts. Screenshots and execution reports remain ignored test artifacts; only reviewed regression baselines and test sources are committed.

## Page composition examples

AppPage, PageHeader, PageToolbar and SearchInput demonstrate one shared composition with a total count, controlled filtering, clear action, disabled search and plain/inset toolbar variants. The composition has its own multi-item installation command, so copied usage code has all its imports available. The catalog search and DataTable playground also use SearchInput. These examples preserve normal tab order and use the shared motion provider.
