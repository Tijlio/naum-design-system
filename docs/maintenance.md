# Maintenance and releases

## Sources and generated files

- `src/components/ui/*`: installable UI components.
- `src/components/blocks/*` and registered Bento compositions: portable blocks with alias-aware component targets.
- `src/lib/utils.ts`, `src/hooks/use-mobile.ts`, `src/components/theme-provider.tsx`: installable support items.
- `src/styles/naum.css`: the shared theme and surfaces.
- `scripts/registry.mjs`: registry assembly, local dependency graph, exact installed npm versions and public export catalog.
- `registry.json`, `public/r/*.json`, `docs/components.md`: generated; never edit them manually.

After changing a source, run `pnpm registry:build`. `pnpm registry:check` compares generated outputs with sources without modifying them. UI additions are discovered automatically. Imports of unregistered local modules or undeclared npm packages fail generation; register a new support module explicitly when needed. Preserve React/React DOM as host dependencies.

Registry dependency URLs point to Naum's own components, so installing Command does not silently install upstream variants of its Dialog/InputGroup. A frozen pnpm installation supplies the exact npm versions emitted into each item. Changes to dependency versions require review and rerunning consumer checks.

## Validation

`pnpm check` runs ESLint, TypeScript, unit/contract tests and registry parity. Unit tests exercise prop/ref forwarding, explicit reduced motion, deterministic skeletons, slider labels, example associations, carousel cleanup, registry schemas and dependency closure.

`pnpm test:registry` starts a temporary loopback registry and installs `command`, the activity timeline, DataTable, saved-view controls, the app shell, both Bento card blocks and `all` with the actual pinned shadcn CLI. Fixtures have their own dependencies and custom directory aliases. Each fixture compiles with strict TypeScript and Tailwind; installed light/dark tokens are compared with the source. The script closes its server and removes only its own temporary consumer directories. It retains `build/registry-install-results.json`. This check requires npm network access and does not mutate an external project.

`pnpm build:test` uses `build/next` so production verification does not overwrite a developer's `.next` build. `tsconfig.build.json` checks the application sources; the ordinary typecheck also covers tests. Never stop somebody else's development server to run tests.

Install Playwright's Chromium, then run `pnpm test:e2e`. Playwright starts and stops its own production server on port 3100; an existing listener produces a failure rather than being reused or terminated. Browser tests cover desktop/mobile viewports, keyboard selection, dialogs and focus restoration, command actions, hydration errors, axe rules, horizontal overflow and visual states in light/dark mode. Automated checks do not replace assistive-technology testing or manual contrast review of gradients/transparency.

## Visual baselines

Baselines live in `tests/e2e/snapshots`. They use the lockfile's Playwright Chromium on macOS; the quality workflow uses `macos-14` to match that platform. To review a deliberate visual change:

```sh
pnpm build:test
pnpm test:e2e --update-snapshots
pnpm test:e2e
```

Inspect changed PNGs before accepting them. Do not update baselines merely to make a failing test pass. Reports and failure traces are in the ignored `build/playwright-report` and `build/test-results`; CI retains them as a short-lived artifact. When moving CI to another platform, create and review matching baselines deliberately.

To keep browser downloads local to ignored build storage, set `PLAYWRIGHT_BROWSERS_PATH=build/playwright-browsers` for both installation and tests. Normal developer installations may use an existing shared browser cache. Clean only task-owned fixtures, downloads and build caches; preserve useful reports and never remove a pre-existing/shared cache.

## Versioned distribution

`main` remains an explicitly documented development channel. Source installation from it can change at any time. A stable release requires generated files whose dependency URLs all point to the same version tag:

```sh
NAUM_REGISTRY_REF=v0.1.0 pnpm registry:build
NAUM_REGISTRY_REF=v0.1.0 pnpm registry:check
```

Use the intended new release version, not an existing published tag. Run the full validation suite against that ref (`NAUM_REGISTRY_REF` must also be set for `pnpm check`). The contract tests verify release references independently of the current build's chosen ref.

Review the generated artifacts, commit the source and generated outputs together, create that version tag on the reviewed commit and publish it through your normal authorized release process. Do not move or reuse published release tags. Only then should consumers select that tag in their registry URL. Committing, tagging and pushing are manual release steps; none of the local scripts or workflows perform them.

The optional “Prepare versioned registry” workflow produces downloadable artifacts for review using the requested version tag. Downloading the artifact is preparation, not publication; its versioned dependency URLs become usable after those generated files exist at that tag. Do not use a commit SHA for this self-hosted release process: embedding a commit's own hash in its contents cannot produce a self-consistent commit.

Use semantic versions: breaking public props, tokens, variants or dependency requirements need a breaking release; backward-compatible additions use a minor release; fixes use a patch release. Record consumer-facing behavior and migration instructions in `CHANGELOG.md`. Components are copied into consumer projects, so updating the registry does not update previously installed source automatically.
