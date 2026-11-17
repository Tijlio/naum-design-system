import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"
import { chooseOption, chooseTime } from "./showcase-controls"
import { settleAnimations } from "./ui-stability"
import { captureVisualEvidence } from "./visual-evidence"

const openExample = async (page: Page, name: string) => {
  await page.goto("/docs")
  await page.getByLabel("Find a component").fill(name)
  await page
    .getByRole("navigation", { name: "Component catalog" })
    .getByRole("button", { name, exact: true })
    .click()
}

test("DateTimePicker documents controlled dates, time, empty and validation recovery", async ({
  page,
}) => {
  await openExample(page, "date-time-picker")
  const picker = page.getByRole("button", { name: "Appointment", exact: true })
  await chooseOption(page, "Example state", "Loading")
  await expect(
    page.getByLabel("Live example").getByRole("status"),
  ).toContainText("Loading appointment")
  await expect(picker).toHaveCount(0)
  await page
    .getByRole("button", { name: "Finish loading", exact: true })
    .click()
  await expect(picker).toBeFocused()
  await chooseOption(page, "Example state", "Error")
  await expect(picker).toHaveAttribute("aria-invalid", "true")
  await expect(
    page.getByLabel("Live example").getByRole("alert"),
  ).toContainText("Choose 17 November 2026 or later")
  await picker.click()
  await page
    .getByRole("button", { name: /Wednesday, November 18th, 2026/ })
    .click()
  await page.getByRole("button", { name: "Done", exact: true }).click()
  await expect(picker).toHaveAttribute("aria-invalid", "false")
  await chooseTime(page, "Appointment", "14", "45")
  await expect(
    page.getByLabel("Live example").getByRole("status"),
  ).toContainText("2026-11-18T14:45")
  await page.getByRole("button", { name: "Clear date", exact: true }).click()
  await expect(picker).toContainText("Choose a date")
  await expect(page.getByLabel("Usage")).toContainText('useState("")')
  await chooseOption(page, "Example state", "Ready")
  await page.getByRole("checkbox", { name: "Date only", exact: true }).check()
  await expect(picker).not.toContainText("09:30")
  await picker.click()
  await expect(
    page.getByLabel("Appointment hour", { exact: true }),
  ).toHaveCount(0)
  await page
    .getByRole("button", { name: /Wednesday, November 18th, 2026/ })
    .click()
  await expect(
    page.getByRole("dialog", { name: "Appointment picker" }),
  ).toBeHidden()
  await expect(
    page.getByLabel("Live example").getByRole("status"),
  ).toContainText("2026-11-18T00:00")
  await chooseOption(page, "Example state", "Error")
  await page
    .getByRole("button", { name: "Use valid date", exact: true })
    .click()
  await expect(picker).toHaveAttribute("aria-invalid", "false")
  await page.getByRole("checkbox", { name: "Disabled", exact: true }).check()
  await expect(picker).toBeDisabled()
})

test("Combobox supports keyboard selection, clearing and request-state recovery", async ({
  page,
}) => {
  await openExample(page, "combobox")
  const trigger = page.getByRole("combobox", {
    name: "Choose team",
    exact: true,
  })
  const input = page.getByRole("combobox", {
    name: "Search teams",
    exact: true,
  })
  await trigger.click()
  await input.fill("Eng")
  await page.keyboard.press("ArrowDown")
  await page.keyboard.press("Enter")
  await expect(
    page.getByLabel("Live example").getByRole("status"),
  ).toContainText("Selected: Engineering")
  await trigger.click()
  await page.getByRole("button", { name: "Clear selection" }).click()
  await expect(input).toHaveValue("")
  await page.keyboard.press("Escape")
  await expect(
    page.getByLabel("Live example").getByRole("status"),
  ).toContainText("Selected: None")
  await trigger.click()
  await input.fill("unknown")
  await expect(
    page.getByText("No matching teams.", { exact: true }),
  ).toBeVisible()
  await page.getByRole("button", { name: "Clear search", exact: true }).click()
  await expect(
    page.getByRole("option", { name: "Design", exact: true }),
  ).toBeVisible()
  await page.keyboard.press("Escape")
  for (const [state, action] of [
    ["Loading", "Finish loading"],
    ["Error", "Retry"],
    ["Empty", "Load sample teams"],
  ]) {
    await chooseOption(page, "Example state", state)
    await page
      .getByRole("combobox", { name: "Choose team", exact: true })
      .click()
    await expect(page.getByRole("option")).toHaveCount(0)
    if (state === "Loading")
      await expect(
        page.getByRole("status").filter({ hasText: "Loading teams" }),
      ).toBeVisible()
    if (state === "Error")
      await expect(
        page
          .getByRole("dialog", { name: "Choose team", exact: true })
          .getByRole("alert"),
      ).toContainText("Could not load teams")
    await page.getByRole("button", { name: action, exact: true }).click()
    await expect(input).toBeFocused()
    await page.getByRole("option", { name: "Sales", exact: true }).click()
    await expect(trigger).toContainText("Sales")
  }
  await page.getByRole("checkbox", { name: "Disabled", exact: true }).check()
  await expect(
    page.getByRole("combobox", { name: "Choose team", exact: true }),
  ).toBeDisabled()
})

for (const name of ["date-time-picker", "combobox"]) {
  test(`${name} popup states remain accessible in both themes and layouts`, async ({
    page,
  }, testInfo) => {
    await openExample(page, name)
    for (const theme of ["light", "dark"]) {
      if (theme === "dark")
        await page
          .getByRole("button", { name: "Toggle light or dark theme" })
          .click()
      for (const state of ["Ready", "Loading", "Error", "Empty"]) {
        await chooseOption(page, "Example state", state)
        await expect(page.locator('[data-slot="select-content"]')).toBeHidden()
        if (name === "combobox")
          await page
            .getByRole("combobox", { name: "Choose team", exact: true })
            .click()
        else if (state !== "Loading")
          await page
            .getByRole("button", { name: "Appointment", exact: true })
            .click()
        await settleAnimations(page)
        expect(
          (
            await new AxeBuilder({ page })
              .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
              .analyze()
          ).violations,
        ).toEqual([])
        expect(
          await page
            .locator("body")
            .evaluate((body) => body.scrollWidth <= body.clientWidth),
        ).toBe(true)
        await captureVisualEvidence(
          page,
          testInfo,
          `${name}-${state.toLowerCase()}-${theme}.png`,
        )
        await page.keyboard.press("Escape")
        await expect(
          page.locator(
            '[data-slot="combobox-content"], [data-slot="popover-content"]',
          ),
        ).toBeHidden()
      }
    }
  })
}
