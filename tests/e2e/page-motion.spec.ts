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

test("stat cards lift and animate their action arrow on hover and keyboard focus", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Exercises desktop hover.")
  await page.goto("/showcase/crm")
  const action = page.getByLabel("Open Pipeline value", { exact: true })
  const card = page.locator("[data-bento-stat-card]").filter({ has: action })
  const arrow = card.locator('[data-slot="bento-stat-card-arrow"]')
  await card.hover({ position: { x: 30, y: 20 } })
  await expect(card).toHaveCSS("translate", "0px -2px")
  await expect(arrow).toHaveCSS("translate", "2px -2px")

  await page.mouse.move(0, 0)
  await expect(card).toHaveCSS("translate", "none")
  await page.keyboard.press("Tab")
  await action.focus()
  await expect(card).toHaveCSS("translate", "0px -2px")
  await expect(arrow).toHaveCSS("translate", "2px -2px")

  await page.emulateMedia({ reducedMotion: "reduce" })
  await card.hover({ position: { x: 30, y: 20 } })
  await expect(card).toHaveCSS("translate", "none")
  await expect(arrow).toHaveCSS("translate", "none")
})
