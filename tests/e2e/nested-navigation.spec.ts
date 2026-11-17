import { expect, test } from "@playwright/test"

test("CRM children expand and collapse while breadcrumbs reflect nested routes", async ({
  page,
}, testInfo) => {
  await page.goto("/showcase/crm/contacts")
  if (testInfo.project.name === "mobile")
    await page.getByRole("button", { name: "Toggle Sidebar" }).click()
  const navigation = page.locator('[data-slot="sidebar"]:visible')
  const group = navigation.getByRole("button", { name: "CRM", exact: true })
  await expect(group).toHaveAttribute("aria-expanded", "true")
  await group.click()
  await expect(
    navigation.getByRole("link", { name: "Contacts", exact: true }),
  ).toBeHidden()
  await group.click()
  await navigation.getByRole("link", { name: "Tasks", exact: true }).click()
  await expect(
    page.getByRole("heading", { name: /Tasks/, level: 1 }),
  ).toBeVisible()
  await expect(page.getByLabel("breadcrumb")).toContainText("Tasks")
})

test("compact navigation keeps nested destinations reachable by keyboard", async ({
  page,
}, testInfo) => {
  await page.goto("/showcase/crm/pipeline")
  await page.getByRole("button", { name: "Toggle Sidebar" }).click()
  if (testInfo.project.name === "desktop") {
    await page.getByRole("button", { name: "CRM", exact: true }).press("Enter")
    const menu = page.getByRole("menu", { name: "CRM navigation" })
    await expect(menu).toBeVisible()
    await menu
      .getByRole("menuitem", { name: "Contacts", exact: true })
      .press("Enter")
  } else
    await page
      .getByRole("dialog")
      .getByRole("link", { name: "Contacts", exact: true })
      .press("Enter")
  await expect(page).toHaveURL(/\/showcase\/crm\/contacts$/)
  await expect(
    page.getByRole("heading", { name: /Contacts/, level: 1 }),
  ).toBeVisible()
})
