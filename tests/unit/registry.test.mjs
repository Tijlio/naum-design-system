// @vitest-environment node
import { readFile, readdir } from "node:fs/promises"
import { resolve } from "node:path"
import { beforeAll, describe, expect, it } from "vitest"
import { registryItemSchema } from "shadcn/schema"
import { createRegistry, root } from "../../scripts/registry.mjs"

let outputs
beforeAll(async () => {
  outputs = await createRegistry({ ref: "main" })
})

describe("consumer registry contract", () => {
  it("ships every UI component and validates the installable payloads", async () => {
    const names = outputs.get("registry.json").items.map((item) => item.name)
    for (const file of await readdir(resolve(root, "src/components/ui"))) {
      if (file.endsWith(".tsx")) expect(names).toContain(file.slice(0, -4))
    }
    for (const [path, payload] of outputs) {
      if (!path.startsWith("public/r/") || path.endsWith("/registry.json"))
        continue
      expect(() => registryItemSchema.parse(payload), path).not.toThrow()
      for (const file of payload.files ?? []) {
        expect(file.content).toBe(
          await readFile(resolve(root, file.path), "utf8"),
        )
      }
    }
  })

  it("resolves each standalone item's complete dependency graph within Naum", () => {
    const items = outputs.get("registry.json").items
    const byName = new Map(items.map((item) => [item.name, item]))
    const visit = (item, ancestors = []) => {
      expect(ancestors, `cycle through ${item.name}`).not.toContain(item.name)
      for (const dependency of item.registryDependencies ?? []) {
        expect(dependency).toMatch(
          /^https:\/\/raw\.githubusercontent\.com\/Tijlio\/naum-design-system\/main\/public\/r\//,
        )
        const target = byName.get(
          dependency.split("/").at(-1).replace(".json", ""),
        )
        expect(target, dependency).toBeDefined()
        visit(target, [...ancestors, item.name])
      }
      for (const dependency of item.dependencies ?? []) {
        expect(dependency).toMatch(/@\d+\.\d+\.\d+(?:-[\w.-]+)?$/)
      }
    }
    for (const item of items) visit(item)
    expect(byName.get("all").registryDependencies).toHaveLength(
      items.length - 1,
    )
  })

  it("ships portable Bento/app blocks with alias-aware component targets", () => {
    for (const name of [
      "data-table",
      "data-table-views",
      "bento-stat-card",
      "bento-insight-card",
      "app-navigation",
      "app-shell",
    ]) {
      const item = outputs.get(`public/r/${name}.json`)
      expect(item.type).toBe("registry:block")
      expect(item.files[0].type).toBe("registry:component")
      expect(item.files[0].target).toMatch(/^@components\//)
      expect(
        item.registryDependencies.some((dependency) =>
          dependency.endsWith("/theme.json"),
        ),
      ).toBe(true)
      expect(item.files[0].content).not.toMatch(/from ["']next[\/"']/)
    }
  })

  it("distributes the typography, radius, surfaces and motion policy together", () => {
    const theme = outputs.get("public/r/theme.json")
    expect(theme.cssVars.theme["radius-3xl"]).toBe("calc(var(--radius) * 2.2)")
    expect(theme.cssVars.theme["font-sans"]).toContain("--font-naum")
    expect(theme.cssVars.light.popover).toBeDefined()
    expect(theme.cssVars.dark["sidebar-ring"]).toBeDefined()
    expect(theme.css["@utility naum-popup-surface"]).toBeDefined()
    expect(theme.css["@layer base"]["*"]).toBeDefined()
    expect(
      theme.css["@layer base"]["@media (prefers-reduced-motion: reduce)"],
    ).toBeDefined()
  })

  it("pins all dependency URLs to the selected release tag", async () => {
    const ref = "v0.2.0"
    const release = await createRegistry({ ref })
    for (const item of release.get("registry.json").items) {
      for (const dependency of item.registryDependencies ?? []) {
        expect(dependency).toContain(`/${ref}/public/r/`)
      }
    }
  })
})
