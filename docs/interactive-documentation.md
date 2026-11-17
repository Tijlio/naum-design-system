# Interactive documentation

Open `/docs` from the component preview or workspace search. The catalog is derived from `registry.json`; each UI component has an installation command and a link to its complete source/types. Copy commands use full registry URLs, so namespace configuration is optional.

Button, Card, Input, Badge, SelectControl, Motion, Dialog and Sheet have interactive examples with usage code and API/accessibility notes. All other primitives load their typed source API directly from the generated registry, with loading, error and retry states, and link to the existing component preview. Bento/app blocks, DataTable, saved-view controls and the activity timeline have live previews and usage snippets, including loading/error/retry and empty states. Changing the selected component resets its playground state. Light/dark styles and responsive controls reuse Naum.

The catalog metadata is generated; examples live in `src/components/docs` and should be updated when their public contracts change. These examples execute normal React components; they do not evaluate user-supplied code.

## Overlay examples

Dialog and Sheet share deterministic ready/loading/error/empty scenarios with Naum Skeleton, Alert, Empty and MotionFadeUp. Change Content state inside the open modal to try recovery without leaving its focus boundary. The ready form validates its name, saves locally to the example and restores trigger focus when closed. Show close button and all four Sheet sides update the copied usage code. Escape and Cancel remain available when the close icon is hidden. State handling belongs to the example form; it does not add request-state props to the primitives.
