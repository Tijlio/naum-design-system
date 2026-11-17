import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import { captureVisualEvidence } from "./visual-evidence"

test("examples have accessible controls and no hydration errors", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  await page.goto("/preview")
  await expect(page.getByRole("checkbox", { name: "Confirmed" })).toBeChecked()
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze()
  expect(results.violations).toEqual([])
  expect(errors).toEqual([])
})

test("dialog supports keyboard dismissal and restores focus", async ({
  page,
}) => {
  await page.goto("/preview")
  const trigger = page.getByRole("button", { name: "Dialog", exact: true })
  await trigger.click()
  const dialog = page.getByRole("dialog", { name: "Confirm action" })
  await expect(dialog).toBeVisible()
  await expect(dialog).toContainText("Confirm")
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  await page.keyboard.press("Escape")
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

test("select and combobox support keyboard selection", async ({ page }) => {
  await page.goto("/preview")
  const region = page.getByLabel("Region", { exact: true })
  await region.focus()
  await page.keyboard.press("ArrowDown")
  await expect(page.getByRole("listbox")).toBeVisible()
  await expect(
    page.getByRole("option", { name: "EU West", exact: true }),
  ).toBeFocused()
  await page.keyboard.press("End")
  await expect(
    page.getByRole("option", { name: "US East", exact: true }),
  ).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(region).toContainText("US East")
  const framework = page.getByRole("combobox", { name: "Framework (Combobox)" })
  await framework.fill("Vite")
  await expect(
    page.getByRole("option", { name: "Vite", exact: true }),
  ).toBeVisible()
  await page.keyboard.press("ArrowDown")
  await page.keyboard.press("Enter")
  await expect(framework).toHaveValue("Vite")
})

test("command palette opens, filters and changes the theme", async ({
  page,
}) => {
  await page.goto("/preview")
  await page.keyboard.press("ControlOrMeta+k")
  const dialog = page.getByRole("dialog", { name: "Command Palette" })
  await expect(dialog).toBeVisible()
  await dialog.getByRole("combobox").fill("Switch")
  await page.keyboard.press("ArrowDown")
  await page.keyboard.press("Enter")
  await expect(dialog).toBeHidden()
  await expect(page.locator("html")).toHaveClass(/dark/)
})

for (const theme of ["light", "dark"] as const) {
  test(`visual variants and states in ${theme} mode`, async ({
    page,
  }, testInfo) => {
    await page.goto("/preview")
    if (theme === "dark")
      await page
        .getByRole("button", { name: "Toggle light or dark theme" })
        .click()
    await page.evaluate(() => document.fonts.ready)
    const buttons = page
      .locator('[data-slot="card"]')
      .filter({ has: page.getByText("Buttons & Badges", { exact: true }) })
    await expect(buttons).toHaveScreenshot(`buttons-${theme}.png`, {
      animations: "disabled",
    })
    await captureVisualEvidence(
      buttons,
      testInfo,
      `preview-buttons-${theme}.png`,
    )
    const forms = page
      .locator('[data-slot="card"]')
      .filter({ has: page.getByText("Form Inputs", { exact: true }) })
    await expect(forms).toHaveScreenshot(`forms-${theme}.png`, {
      animations: "disabled",
    })
    await captureVisualEvidence(forms, testInfo, `preview-forms-${theme}.png`)
    const surfaces = page.locator('[data-slot="card"]').filter({
      has: page.getByText("Card Surfaces Side by Side", { exact: true }),
    })
    await expect(surfaces).toHaveScreenshot(`surfaces-${theme}.png`, {
      animations: "disabled",
    })
    await captureVisualEvidence(
      surfaces,
      testInfo,
      `preview-surfaces-${theme}.png`,
    )
    await expect(page.locator("body")).toHaveJSProperty(
      "scrollWidth",
      await page.locator("body").evaluate((body) => body.clientWidth),
    )
  })
}

test("reduced motion prevents hover movement and SVG drawing", async ({
  page,
}) => {
  await page.goto("/")
  const card = page.locator(".naum-card-lift").first()
  await card.hover()
  await expect(card).toHaveCSS("transform", "none")
  const animatedPath = page
    .locator("path[stroke-dasharray]")
    .filter({ hasNot: page.locator("defs") })
  // Custom draw paths have an inline opacity, unlike chart grid paths.
  const drawPath = page.locator('path[style*="opacity"]').first()
  await expect(drawPath).toHaveCSS("opacity", "1")
  await expect(animatedPath.first()).toBeAttached()
})
