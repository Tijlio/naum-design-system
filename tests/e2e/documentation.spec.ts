import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import { chooseOption } from "./showcase-controls"
import { captureVisualEvidence } from "./visual-evidence"

test("documentation connects interactive variants, code and registry installation", async ({
  page,
}) => {
  await page.goto("/docs")
  await expect(
    page.getByRole("heading", { name: "Documentation", exact: true }),
  ).toBeVisible()
  await chooseOption(page, "Variant", "glow")
  await expect(
    page.getByLabel("Live example").getByRole("button", { name: "Continue" }),
  ).toBeVisible()
  await expect(page.getByLabel("Usage").getByRole("code")).toContainText(
    'variant="glow"',
  )
  await chooseOption(page, "State", "disabled")
  await expect(
    page.getByLabel("Live example").getByRole("button", { name: "Continue" }),
  ).toBeDisabled()
  await page.getByLabel("Find a component").fill("select-control")
  await page
    .getByRole("navigation", { name: "Component catalog" })
    .getByRole("button", { name: "select-control", exact: true })
    .click()
  await expect(page.getByLabel("Installation")).toContainText(
    "/public/r/select-control.json",
  )
  await chooseOption(page, "Team", "Sales")
  await expect(page.getByLabel("API")).toContainText("onValueChange")
  await page.getByLabel("Find a component").fill("does-not-exist")
  await expect(
    page.getByRole("status").filter({ hasText: "No matching components" }),
  ).toBeVisible()
})

test("documentation remains accessible in both themes and compact layouts", async ({
  page,
}, testInfo) => {
  await page.goto("/docs")
  for (const theme of ["light", "dark"]) {
    if (theme === "dark")
      await page
        .getByRole("button", { name: "Toggle light or dark theme" })
        .click()
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
      `documentation-${theme}.png`,
      true,
    )
  }
})

test("installable blocks expose working examples and usage", async ({
  page,
}) => {
  await page.goto("/docs")
  const catalog = page.getByRole("navigation", { name: "Component catalog" })
  await page.getByLabel("Find a component").fill("bento-stat-card")
  await catalog
    .getByRole("button", { name: "bento-stat-card Block", exact: true })
    .click()
  await chooseOption(page, "Trend", "Down")
  await expect(
    page.getByLabel("Block preview").getByRole("img"),
  ).toHaveAttribute("aria-label", "Compared with last month")
  await expect(page.getByLabel("Block usage")).toContainText(
    'direction: "down"',
  )
  await page.getByLabel("Find a component").fill("app-navigation")
  await catalog
    .getByRole("button", { name: "app-navigation Block", exact: true })
    .click()
  const contacts = page
    .getByLabel("Block preview")
    .getByRole("button", { name: "Contacts" })
  await contacts.click()
  await expect(contacts).toHaveAttribute("aria-current", "page")
  await page.getByLabel("Find a component").fill("app-shell")
  await catalog
    .getByRole("button", { name: "app-shell Block", exact: true })
    .click()
  await expect(
    page
      .frameLocator('iframe[title="App shell live example"]')
      .getByRole("heading", { name: "Good morning, Alex" }),
  ).toBeVisible()
})

test("typed source reference recovers from a failed load", async ({ page }) => {
  let requests = 0
  await page.route("**/r/accordion.json", (route) =>
    ++requests === 1 ? route.abort() : route.continue(),
  )
  await page.goto("/docs")
  await page.getByLabel("Find a component").fill("accordion")
  await page
    .getByRole("navigation", { name: "Component catalog" })
    .getByRole("button", { name: "accordion", exact: true })
    .click()
  await expect(
    page.getByLabel("Typed source API").getByRole("alert"),
  ).toContainText("Source could not be loaded.")
  await page.getByRole("button", { name: "Retry source" }).click()
  await expect(page.getByLabel("Typed source API")).toContainText(
    "AccordionTrigger",
  )
  await expect(
    page.getByRole("button", { name: "Copy component source" }),
  ).toBeVisible()
})

test("DataTable, view controls and timeline examples work independently of CRM data", async ({
  page,
}) => {
  await page.goto("/docs")
  const catalog = page.getByRole("navigation", { name: "Component catalog" })
  await page.getByLabel("Find a component").fill("data-table")
  await catalog
    .getByRole("button", { name: "data-table Block", exact: true })
    .click()
  await page.getByRole("textbox", { name: "Search members" }).fill("Emma")
  await expect(page.getByRole("table", { name: "Members" })).toContainText(
    "Emma Laurent",
  )
  await expect(page.getByRole("table", { name: "Members" })).not.toContainText(
    "Oliver Chen",
  )
  await chooseOption(page, "Example state", "Error")
  await expect(
    page.getByRole("table", { name: "Members" }).getByRole("alert"),
  ).toContainText("Members could not be loaded")
  await page.getByRole("button", { name: "Retry", exact: true }).click()
  await expect(page.getByRole("table", { name: "Members" })).toContainText(
    "Emma Laurent",
  )
  await catalog
    .getByRole("button", { name: "data-table-views Block", exact: true })
    .click()
  await page.getByRole("button", { name: "Save view", exact: true }).click()
  const form = page.getByRole("dialog", { name: "Save view", exact: true })
  await form.getByLabel("View name").fill("View " + "x".repeat(50))
  await form.getByRole("button", { name: "Save view", exact: true }).click()
  await expect(
    page.getByRole("combobox", { name: "Saved view" }),
  ).toContainText("View " + "x".repeat(50))
  expect(
    await page
      .locator("body")
      .evaluate((body) => body.scrollWidth <= body.clientWidth),
  ).toBe(true)
  await page.getByLabel("Find a component").fill("activity-timeline")
  await catalog
    .getByRole("button", { name: "activity-timeline Block", exact: true })
    .click()
  await page
    .getByRole("button", { name: "Show empty state", exact: true })
    .click()
  await expect(page.getByText("No activity yet", { exact: true })).toBeVisible()
})
