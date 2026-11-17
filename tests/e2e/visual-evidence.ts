import type { Locator, Page, TestInfo } from "@playwright/test"

export const captureVisualEvidence = async (
  target: Page | Locator,
  testInfo: TestInfo,
  name: string,
  fullPage = false,
) => {
  const path = testInfo.outputPath(name)
  if ("goto" in target)
    await target.screenshot({ path, fullPage, animations: "disabled" })
  else await target.screenshot({ path, animations: "disabled" })
  await testInfo.attach(name, { path, contentType: "image/png" })
}
