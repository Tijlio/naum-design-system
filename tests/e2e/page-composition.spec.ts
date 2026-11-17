import { expect, test } from "@playwright/test"
import { chooseOption } from "./showcase-controls"

for (const entry of [
  "app-page",
  "page-header",
  "page-toolbar",
  "search-input",
]) {
  test(`${entry} documents an installable interactive page composition`, async ({
    page,
  }) => {
    await page.goto("/docs")
    await page.getByLabel("Find a component").fill(entry)
    await page
      .getByRole("navigation", { name: "Component catalog" })
      .getByRole("button", {
        name: entry === "search-input" ? entry : `${entry} Block`,
        exact: true,
      })
      .click()
    const example = page.getByLabel("Live example")
    await example
      .getByRole("searchbox", { name: "Search demo contacts" })
      .fill("Emma")
    await expect(example.getByRole("status")).toHaveText("1 matching contact")
    await expect(example.getByRole("list")).not.toContainText("Oliver")
    await chooseOption(page, "Toolbar padding", "Inset")
    await expect(page.getByLabel("Usage")).toContainText('variant="inset"')
    await page.getByRole("checkbox", { name: "Disable search" }).check()
    await expect(example.getByRole("searchbox")).toBeDisabled()
    await page.getByRole("checkbox", { name: "Disable search" }).uncheck()
    await example.getByRole("button", { name: "Clear search" }).click()
    await expect(example.getByRole("searchbox")).toHaveValue("")
    await expect(page.getByLabel("Composition installation")).toContainText(
      "/r/search-input.json",
    )
  })
}
