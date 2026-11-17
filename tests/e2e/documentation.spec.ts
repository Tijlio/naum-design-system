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
