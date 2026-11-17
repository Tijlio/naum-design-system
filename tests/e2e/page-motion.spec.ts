import { expect, test } from "@playwright/test"
import { settleAnimations } from "./ui-stability"

test.use({ reducedMotion: "no-preference" })

test("route pages animate together and query-only updates retain the page boundary", async ({
  page,
}, testInfo) => {
  await page.goto("/showcase/crm/contacts")
  if (testInfo.project.name === "mobile")
    await page.getByRole("button", { name: "Toggle Sidebar" }).click()
  const navigation = page.locator('[data-slot="sidebar"]:visible')
  for (const name of [
    "Pipeline",
    "Tasks",
    "Overview",
    "Calendar",
    "Contacts",
  ]) {
    // Mobile destinations close their sheet, so reopen it for the next route.
    if (testInfo.project.name === "mobile" && !(await navigation.isVisible()))
      await page.getByRole("button", { name: "Toggle Sidebar" }).click()
    await navigation.getByRole("link", { name, exact: true }).click()
    const content = page.locator('[data-slot="app-page"]')
    await expect(content).toBeVisible()
    // The title and page contents share one transition boundary on every route.
    await expect(content.getByRole("heading", { level: 1 })).toBeVisible()
    await settleAnimations(page)
    await expect(content).toHaveCSS("opacity", "1")
    await expect(content).toHaveCSS("transform", "none")
  }
  const pageBoundary = await page
    .locator('[data-slot="app-page"]')
    .elementHandle()
  await page
    .getByRole("searchbox", { name: "Search contacts", exact: true })
    .fill("Emma")
  await expect(
    page.getByRole("table", { name: "Contacts", exact: true }),
  ).toContainText("Emma Laurent")
  expect(await pageBoundary?.evaluate((node) => node.isConnected)).toBe(true)
  await expect(
    page.getByRole("searchbox", { name: "Search contacts", exact: true }),
  ).toBeFocused()
  await pageBoundary?.dispose()
})
