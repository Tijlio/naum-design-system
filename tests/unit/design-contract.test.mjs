// @vitest-environment node
import { readFile } from "node:fs/promises"
import postcss from "postcss"
import { describe, expect, it } from "vitest"
import { createMotionTokens } from "../../scripts/motion-tokens.mjs"
import { createRegistry } from "../../scripts/registry.mjs"

describe("design-system distribution contract", () => {
  it("generates Motion defaults and its installable source from the CSS contract", async () => {
    const css = postcss.parse(await readFile("src/styles/naum.css", "utf8"))
    const generated = await createMotionTokens(css)
    const outputs = await createRegistry()
    expect(outputs.get("src/lib/motion-tokens.ts")).toBe(generated)
    expect(outputs.get("public/r/motion-tokens.json").files[0].content).toBe(
      generated,
    )
    expect(generated).toBe(await readFile("src/lib/motion-tokens.ts", "utf8"))
    // An edit to one CSS token changes the distributed numeric default as well.
    css.walkDecls("--naum-duration-enter", (node) => {
      node.value = "420ms"
    })
    expect(await createMotionTokens(css)).toContain("enter: 0.42")
  })

  it("rejects unsupported time units instead of silently distributing a wrong speed", async () => {
    const css = postcss.parse(await readFile("src/styles/naum.css", "utf8"))
    css.walkDecls("--naum-duration-enter", (node) => {
      node.value = "slow"
    })
    await expect(createMotionTokens(css)).rejects.toThrow(
      "Invalid motion token --naum-duration-enter",
    )
  })

  it("ships spacing and paired tone colors in both themes", async () => {
    const theme = (await createRegistry()).get("public/r/theme.json")
    expect(theme.cssVars.light["naum-space-page"]).toBeDefined()
    expect(theme.cssVars.light["naum-inset-panel"]).toBeDefined()
    for (const mode of ["light", "dark"])
      for (const tone of ["lavender", "mint", "amber"])
        for (const role of ["background", "foreground"])
          expect(theme.cssVars[mode][`tone-${tone}-${role}`]).toBeDefined()
    for (const name of [
      "naum-surface-card",
      "naum-surface-frosted",
      "naum-active-pill",
      "naum-tone",
    ])
      expect(theme.css[`@utility ${name}`]).toBeDefined()
  })
})
