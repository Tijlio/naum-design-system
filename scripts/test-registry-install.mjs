import { execFile } from "node:child_process"
import { createServer } from "node:http"
import { mkdir, mkdtemp, readFile, writeFile, rm } from "node:fs/promises"
import { resolve } from "node:path"
import { promisify } from "node:util"
import postcss from "postcss"
import tailwind from "@tailwindcss/postcss"
import { createRegistry, root } from "./registry.mjs"

const exec = promisify(execFile)
const manifest = JSON.parse(
  await readFile(resolve(root, "package.json"), "utf8"),
)
const build = resolve(root, "build")
await mkdir(build, { recursive: true })
const temporary = await mkdtemp(resolve(build, "registry-install-"))
let outputs
const server = createServer((request, response) => {
  const item = outputs?.get(`public${request.url}`)
  response.writeHead(item ? 200 : 404, { "Content-Type": "application/json" })
  response.end(JSON.stringify(item ?? { error: "Unknown item" }))
})
await new Promise((accept) => server.listen(0, "127.0.0.1", accept))
const baseUrl = `http://127.0.0.1:${server.address().port}/r`
const report = []

try {
  outputs = await createRegistry({ baseUrl })
  for (const item of ["command", "all"]) {
    const cwd = resolve(temporary, item)
    await mkdir(resolve(cwd, "src"), { recursive: true })
    const json = async (path, value) =>
      writeFile(resolve(cwd, path), JSON.stringify(value, null, 2))
    await json("package.json", {
      name: `naum-consumer-${item}`,
      private: true,
      type: "module",
      packageManager: manifest.packageManager,
      dependencies: {
        react: manifest.dependencies.react,
        "react-dom": manifest.dependencies["react-dom"],
      },
      devDependencies: {
        typescript: manifest.devDependencies.typescript,
        "@types/react": manifest.devDependencies["@types/react"],
        "@types/react-dom": manifest.devDependencies["@types/react-dom"],
        tailwindcss: manifest.devDependencies.tailwindcss,
      },
    })
    await json("tsconfig.json", {
      compilerOptions: {
        target: "ES2022",
        lib: ["ES2022", "DOM", "DOM.Iterable"],
        module: "ESNext",
        moduleResolution: "bundler",
        jsx: "react-jsx",
        strict: true,
        skipLibCheck: true,
        noEmit: true,
        esModuleInterop: true,
        paths: { "@/*": ["./src/*"] },
      },
      include: ["src"],
    })
    await json("components.json", {
      $schema: "https://ui.shadcn.com/schema.json",
      style: "base-maia",
      rsc: true,
      tsx: true,
      tailwind: {
        config: "",
        css: "src/globals.css",
        baseColor: "neutral",
        cssVariables: true,
        prefix: "",
      },
      iconLibrary: "lucide",
      aliases: {
        components: "@/kit",
        ui: "@/kit/ui",
        utils: "@/shared/utils",
        lib: "@/shared",
        hooks: "@/state",
      },
    })
    await writeFile(resolve(cwd, "src/globals.css"), '@import "tailwindcss";\n')
    console.log(
      `Installing @naum/${item} into a clean consumer with custom aliases…`,
    )
    try {
      await exec("pnpm", ["install", "--ignore-scripts"], {
        cwd,
        maxBuffer: 4 * 1024 * 1024,
        timeout: 180_000,
      })
      await exec(
        "node",
        [
          resolve(root, "node_modules/shadcn/dist/index.js"),
          "add",
          `${baseUrl}/${item}.json`,
          "--cwd",
          cwd,
          "--yes",
          "--overwrite",
          "--silent",
        ],
        {
          cwd,
          maxBuffer: 4 * 1024 * 1024,
          timeout: 180_000,
        },
      )
      await exec(
        "node",
        [resolve(root, "node_modules/typescript/bin/tsc"), "--project", cwd],
        { cwd, maxBuffer: 2 * 1024 * 1024 },
      )
    } catch (error) {
      console.error(error.stdout ?? "", error.stderr ?? error.message)
      throw new Error(
        `Consumer ${item} failed:\n${error.stdout ?? ""}\n${error.stderr ?? error.message}`,
        { cause: error },
      )
    }
    const cssPath = resolve(cwd, "src/globals.css")
    const source = await readFile(cssPath, "utf8")
    const compiled = await postcss([tailwind({ base: cwd })]).process(source, {
      from: cssPath,
    })
    if (
      !compiled.css.includes("backdrop-filter") ||
      !source.includes("--radius-3xl")
    ) {
      throw new Error(`Consumer ${item} did not receive the theme`)
    }
    const syntax = postcss.parse(source)
    const theme = outputs.get("public/r/theme.json")
    for (const [scope, selector] of [
      ["light", ":root"],
      ["dark", ".dark"],
    ]) {
      const actual = {}
      syntax.walkRules(selector, (rule) =>
        rule.walkDecls((declaration) => {
          actual[declaration.prop.slice(2)] = declaration.value
        }),
      )
      for (const [token, value] of Object.entries(theme.cssVars[scope])) {
        if (actual[token] !== value)
          throw new Error(
            `Consumer ${item}: missing or changed ${scope} token ${token}`,
          )
      }
    }
    report.push({
      item,
      types: "passed",
      css: "passed",
      aliases: "passed",
      tokens: "passed",
    })
    console.log(
      `@naum/${item}: TypeScript, Tailwind compilation and theme parity passed.`,
    )
  }
  await writeFile(
    resolve(build, "registry-install-results.json"),
    JSON.stringify(report, null, 2) + "\n",
  )
} finally {
  await new Promise((accept, reject) =>
    server.close((error) => (error ? reject(error) : accept())),
  )
  // Only this invocation's mkdtemp directory; never remove a shared build directory.
  await rm(temporary, { recursive: true, maxRetries: 5, retryDelay: 200 })
}
