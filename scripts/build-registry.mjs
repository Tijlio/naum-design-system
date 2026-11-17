import { readFile, readdir, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import { createRegistry, root } from "./registry.mjs"

const check = process.argv.includes("--check")
const outputs = await createRegistry()
for (const name of await readdir(resolve(root, "public/r"))) {
  if (name.endsWith(".json") && !outputs.has(`public/r/${name}`)) {
    throw new Error(
      `public/r/${name} no longer has a source. Review and remove the obsolete generated item.`,
    )
  }
}
for (const [path, value] of outputs) {
  const content =
    typeof value === "string" ? value : JSON.stringify(value, null, 2) + "\n"
  const target = resolve(root, path)
  if (check) {
    const current = await readFile(target, "utf8").catch((error) => {
      if (error.code !== "ENOENT") throw error
      return null
    })
    if (current !== content)
      throw new Error(`${path} is stale. Run pnpm registry:build.`)
  } else {
    await writeFile(target, content)
  }
}
console.log(
  check ? "Registry is current." : "Built all registry items from source.",
)
