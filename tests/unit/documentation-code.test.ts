// @vitest-environment node
import { resolve } from "node:path"
import ts from "typescript"
import { expect, test } from "vitest"
import { overlayExampleCode } from "@/components/docs/overlay-example-code"
import { dateTimePickerExampleCode } from "@/components/docs/date-time-picker-example-code"
import { comboboxExampleCode } from "@/components/docs/combobox-example-code"

// Compile copied examples against the real exported component contracts.
test("interactive documentation snippets typecheck for every state and variant", () => {
  const samples: string[] = []
  for (const state of ["ready", "loading", "error", "empty"] as const) {
    for (const showClose of [true, false]) {
      samples.push(overlayExampleCode("dialog", state, "right", showClose))
      for (const side of ["top", "right", "bottom", "left"] as const) {
        samples.push(overlayExampleCode("sheet", state, side, showClose))
      }
    }
    for (const disabled of [true, false]) {
      samples.push(comboboxExampleCode(state, disabled))
      for (const dateOnly of [true, false]) {
        samples.push(dateTimePickerExampleCode(state, dateOnly, disabled))
      }
    }
  }
  const virtualFiles = new Map(
    samples.map((code, index) => [
      resolve(`src/components/docs/sample-${index}.tsx`),
      code,
    ]),
  )
  const config = ts.readConfigFile(resolve("tsconfig.json"), ts.sys.readFile)
  const { options } = ts.parseJsonConfigFileContent(
    config.config,
    ts.sys,
    process.cwd(),
  )
  options.incremental = false
  const host = ts.createCompilerHost(options)
  const originalGetSourceFile = host.getSourceFile
  host.getSourceFile = (
    filename,
    languageVersion,
    onError,
    shouldCreateNewSourceFile,
  ) => {
    const code = virtualFiles.get(filename)
    return code === undefined
      ? originalGetSourceFile(
          filename,
          languageVersion,
          onError,
          shouldCreateNewSourceFile,
        )
      : ts.createSourceFile(filename, code, languageVersion, true)
  }
  const program = ts.createProgram([...virtualFiles.keys()], options, host)
  const diagnostics = ts.getPreEmitDiagnostics(program)
  expect(
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: (filename) => filename,
      getCurrentDirectory: process.cwd,
      getNewLine: () => "\n",
    }),
  ).toBe("")
}, 20_000)
