import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import { settleAnimations } from "./ui-stability"
import { captureVisualEvidence } from "./visual-evidence"

test("workspace views share page structure, toolbar geometry and labeled search fields", async ({
  page,
}, testInfo) => {
  for (const [path, label] of [
    ["/showcase/crm", "Overview"],
    ["/showcase/crm/contacts", "Contacts"],
    ["/showcase/crm/tasks", "Tasks"],
    ["/showcase/crm/pipeline", "Pipeline"],
    ["/showcase/crm/pipeline?layout=table", "Pipeline table"],
    ["/showcase/calendar", "Calendar"],
  ]) {
    await page.goto(path)
    const content = page.locator('[data-slot="app-page"]')
    await expect(content).toHaveCount(1)
    const header = content.locator('[data-slot="page-header"]')
    await expect(header.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(content).toHaveCSS("row-gap", "24px")
    if (label !== "Overview" && label !== "Calendar") {
      const search = content.getByRole("searchbox")
      await expect(search).toBeVisible()
      const dimensions = await search.locator("..").boundingBox()
      expect(dimensions?.height).toBe(36)
      if (testInfo.project.name === "mobile")
        expect(dimensions?.width).toBeGreaterThanOrEqual(280)
      await expect(search.locator("..").locator("svg")).toHaveCount(1)
      const heading = await header
        .getByRole("heading", { level: 1 })
        .textContent()
      await search.fill("No matching records")
      await expect(header.getByRole("heading", { level: 1 })).toHaveText(
        heading ?? "",
      )
      await search.fill("")
    }
    if (
      label === "Contacts" ||
      label === "Tasks" ||
      label === "Pipeline table" ||
      label === "Calendar"
    ) {
      const toolbar =
        label === "Calendar"
          ? content.getByRole("group", { name: "Calendar navigation" })
          : content.getByRole("group", {
              name:
                label === "Pipeline table"
                  ? "Opportunities controls"
                  : `${label} controls`,
            })
      await expect(toolbar).toHaveCSS("padding-top", "24px")
      await expect(toolbar).toHaveCSS("padding-bottom", "24px")
    }
    for (const theme of ["light", "dark"]) {
      if (theme === "dark")
        await page
          .getByRole("button", { name: "Toggle light or dark theme" })
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
        `${label.toLowerCase().replaceAll(" ", "-")}-${theme}.png`,
      )
    }
    // Restore light before the next route in this same browser context.
    await page
      .getByRole("button", { name: "Toggle light or dark theme" })
      .click()
  }
})

test("long saved-view names remain contained within the page toolbar", async ({
  page,
}) => {
  await page.goto("/showcase/crm/contacts")
  await page.getByRole("button", { name: "Save view", exact: true }).click()
  const dialog = page.getByRole("dialog", { name: "Save view", exact: true })
  const name = "Workspace " + "x".repeat(50)
  await dialog.getByLabel("View name", { exact: true }).fill(name)
  await dialog.getByRole("button", { name: "Save view", exact: true }).click()
  await expect(dialog).toBeHidden()
  await expect(
    page.getByRole("combobox", { name: "Saved view", exact: true }),
  ).toContainText(name)
  expect(
    await page
      .locator("body")
      .evaluate((body) => body.scrollWidth <= body.clientWidth),
  ).toBe(true)
  const viewControls = page.getByRole("group", {
    name: "View controls",
    exact: true,
  })
  expect(
    await viewControls.evaluate((node) => node.scrollWidth <= node.clientWidth),
  ).toBe(true)
})
