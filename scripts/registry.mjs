import { readFile, readdir } from "node:fs/promises"
import { resolve } from "node:path"
import postcss from "postcss"
import ts from "typescript"
import { registrySchema } from "shadcn/schema"

export const root = resolve(import.meta.dirname, "..")
const read = (path) => readFile(resolve(root, path), "utf8")

// Preserve nested selectors and at-rules, including media queries, in shadcn CSS.
export const cssObject = (container) => {
  const result = {}
  const merge = (key, value) => {
    if (result[key] && typeof value === "object") {
      result[key] = { ...result[key], ...value }
    } else result[key] = value
  }
  for (const node of container.nodes ?? []) {
    if (node.type === "decl") {
      result[node.prop] = node.value + (node.important ? " !important" : "")
    } else if (node.type === "rule") {
      merge(node.selector, cssObject(node))
    } else if (node.type === "atrule") {
      merge(
        `@${node.name}${node.params ? ` ${node.params}` : ""}`,
        node.nodes ? cssObject(node) : {},
      )
    }
  }
  return result
}

const installedVersion = async (name) => {
  const manifest = JSON.parse(await read(`node_modules/${name}/package.json`))
  return `${name}@${manifest.version}`
}

export const createRegistry = async ({
  ref = process.env.NAUM_REGISTRY_REF ?? "main",
  baseUrl = process.env.NAUM_REGISTRY_BASE_URL ??
    `https://raw.githubusercontent.com/Tijlio/naum-design-system/${ref}/public/r`,
} = {}) => {
  if (!/^(main|v[\w.-]+|[a-f0-9]{40})$/.test(ref)) {
    throw new Error(
      "Use main, a version tag, or a full commit SHA as NAUM_REGISTRY_REF",
    )
  }
  const url = (name) => `${baseUrl.replace(/\/$/, "")}/${name}.json`
  const manifest = JSON.parse(await read("package.json"))
  const css = postcss.parse(await read("src/styles/naum.css"))
  const cssVars = { light: {}, dark: {}, theme: {} }
  for (const node of [...css.nodes]) {
    const scope =
      node.type === "rule" && node.selector === ":root"
        ? "light"
        : node.type === "rule" && node.selector === ".dark"
          ? "dark"
          : node.type === "atrule" && node.name === "theme"
            ? "theme"
            : null
    if (scope) {
      node.each((declaration) => {
        if (declaration.type === "decl") {
          cssVars[scope][declaration.prop.slice(2)] = declaration.value
        }
      })
      node.remove()
    }
  }
  const theme = {
    name: "theme",
    type: "registry:style",
    title: "Naum Theme",
    description:
      "Semantic light/dark tokens, radius and typography scales, surfaces and reduced-motion styles.",
    dependencies: [
      await installedVersion("tw-animate-css"),
      await installedVersion("shadcn"),
    ],
    cssVars,
    css: {
      '@import "tw-animate-css"': {},
      '@import "shadcn/tailwind.css"': {},
      ...cssObject(css),
    },
  }
  const entries = (await readdir(resolve(root, "src/components/ui")))
    .filter((name) => name.endsWith(".tsx"))
    .sort()
    .map((name) => ({
      name: name.slice(0, -4),
      path: `src/components/ui/${name}`,
      type: "registry:ui",
    }))
  entries.push(
    { name: "utils", path: "src/lib/utils.ts", type: "registry:lib" },
    {
      name: "use-mobile",
      path: "src/hooks/use-mobile.ts",
      type: "registry:hook",
    },
    {
      name: "theme-provider",
      path: "src/components/theme-provider.tsx",
      type: "registry:component",
    },
  )
  entries.push(
    ...(await readdir(resolve(root, "src/components/blocks")))
      .filter((name) => name.endsWith(".tsx"))
      .sort()
      .map((name) => ({
        name: name.slice(0, -4),
        path: `src/components/blocks/${name}`,
        type: "registry:block",
        target: `@components/blocks/${name}`,
      })),
    {
      name: "bento-insight-card",
      path: "src/components/bento/insight-card.tsx",
      type: "registry:block",
      target: "@components/bento/insight-card.tsx",
    },
    {
      name: "metric-value",
      path: "src/components/bento/metric-value.tsx",
      type: "registry:component",
      target: "@components/bento/metric-value.tsx",
    },
    {
      name: "metric-trend",
      path: "src/components/bento/metric-trend.tsx",
      type: "registry:component",
      target: "@components/bento/metric-trend.tsx",
    },
    {
      name: "navigation-styles",
      path: "src/lib/navigation-styles.ts",
      type: "registry:lib",
    },
  )
  const names = new Map(
    entries.map((entry) => [entry.path.replace(/\.tsx?$/, ""), entry.name]),
  )
  const contents = new Map()
  const catalog = []
  const items = [theme]
  for (const entry of entries) {
    const content = await read(entry.path)
    contents.set(entry.path, content)
    const source = ts.createSourceFile(
      entry.path,
      content,
      ts.ScriptTarget.Latest,
      true,
    )
    const exports = []
    for (const statement of source.statements) {
      if (
        ts.isExportDeclaration(statement) &&
        statement.exportClause &&
        ts.isNamedExports(statement.exportClause)
      ) {
        exports.push(
          ...statement.exportClause.elements.map(
            (element) => element.name.text,
          ),
        )
      } else if (
        ts.getCombinedModifierFlags(statement) & ts.ModifierFlags.Export
      ) {
        if (ts.isVariableStatement(statement)) {
          exports.push(
            ...statement.declarationList.declarations.map((declaration) =>
              declaration.name.getText(source),
            ),
          )
        } else if (statement.name) exports.push(statement.name.text)
      }
    }
    catalog.push(
      `| \`${entry.name}\` | ${exports.map((name) => `\`${name}\``).join(", ")} | [Source](../${entry.path}) |`,
    )
    const dependencies = new Set()
    const registryDependencies = new Set(
      ["registry:ui", "registry:block"].includes(entry.type)
        ? [url("theme")]
        : [],
    )
    for (const statement of source.statements) {
      if (
        (!ts.isImportDeclaration(statement) &&
          !ts.isExportDeclaration(statement)) ||
        !statement.moduleSpecifier
      )
        continue
      const specifier = statement.moduleSpecifier.text
      if (specifier.startsWith("@/")) {
        const name = names.get(specifier.replace("@/", "src/"))
        if (!name)
          throw new Error(`Unregistered import ${specifier} in ${entry.path}`)
        registryDependencies.add(url(name))
      } else {
        const name = specifier.startsWith("@")
          ? specifier.split("/").slice(0, 2).join("/")
          : specifier.split("/")[0]
        if (["react", "react-dom"].includes(name)) continue
        if (!manifest.dependencies[name])
          throw new Error(`Undeclared package ${name} in ${entry.path}`)
        dependencies.add(await installedVersion(name))
      }
    }
    items.push({
      name: entry.name,
      type: entry.type,
      title: `Naum ${entry.name
        .split("-")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" ")}`,
      description: `Naum ${entry.name} for React and Tailwind CSS v4.`,
      ...(dependencies.size ? { dependencies: [...dependencies].sort() } : {}),
      ...(registryDependencies.size
        ? { registryDependencies: [...registryDependencies].sort() }
        : {}),
      files: [
        {
          path: entry.path,
          type:
            entry.type === "registry:block" ? "registry:component" : entry.type,
          ...(entry.target ? { target: entry.target } : {}),
        },
      ],
    })
  }
  items.push({
    name: "all",
    type: "registry:style",
    title: "Naum Complete Preset",
    description:
      "Every Naum UI component, shared dependency, theme and provider.",
    registryDependencies: items.map((item) => url(item.name)),
  })
  const registry = registrySchema.parse({
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: manifest.name,
    homepage: "https://github.com/Tijlio/naum-design-system",
    items,
  })
  const outputs = new Map([
    ["registry.json", registry],
    ["public/r/registry.json", registry],
  ])
  outputs.set(
    "docs/components.md",
    [
      "# Component catalog",
      "",
      "<!-- Generated by pnpm registry:build. Edit the component sources, not this catalog. -->",
      "",
      "Install an item with `pnpm dlx shadcn@4.23.0 add @naum/<name>`. Every UI item includes its Naum dependencies and theme. React is supplied by the host project.",
      "",
      "`theme` installs tokens, surfaces, typography/radius mappings and CSS motion policy. `all` installs every item below plus the theme. [Integration examples and contracts](design-system.md) cover the custom variants and providers.",
      "",
      "| Registry item | Public exports (including types) | Reference |",
      "| --- | --- | --- |",
      ...catalog,
      "",
      "The source props are the API reference. Base UI wrappers preserve primitive props; Naum-specific variants and provider requirements are described in the integration guide.",
      "",
    ].join("\n"),
  )
  for (const item of registry.items) {
    outputs.set(`public/r/${item.name}.json`, {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      ...item,
      ...(item.files
        ? {
            files: item.files.map((file) => ({
              ...file,
              content: contents.get(file.path),
            })),
          }
        : {}),
    })
  }
  return outputs
}
