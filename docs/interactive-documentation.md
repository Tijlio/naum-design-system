# Interactive documentation

Open `/docs` from the component preview or workspace search. The catalog is derived from `registry.json`; each UI component has an installation command and a link to its complete source/types. Copy commands use full registry URLs, so namespace configuration is optional.

Button, Card, Input, Badge, SelectControl and Motion have interactive examples with usage code and API/accessibility notes. Other primitives link to their source and the existing component preview. Changing the selected component resets its playground state. Light/dark styles and responsive controls reuse Naum.

The catalog metadata is generated; examples live in `src/components/docs` and should be updated when their public contracts change. These examples execute normal React components; they do not evaluate user-supplied code.
