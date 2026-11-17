import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import { chooseOption } from "./showcase-controls"

test("search expands, filters results and restores focus", async ({ page }) => {
  await page.goto("/")
  const trigger = page.getByRole("button", { name: "Search", exact: true })
  await trigger.click()
  const input = page.getByRole("combobox", { name: "Search workspace" })
  await expect(input).toBeFocused()
  await input.fill("CRM overview")
  await expect(page.getByRole("option", { name: /CRM overview/ })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(trigger).toBeFocused()
  await trigger.click()
  await input.fill("CRM overview")
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/\/showcase\/crm$/)
})

test("Bento search opens without moving the header or dashboard", async ({
  page,
}, testInfo) => {
  const sizes = testInfo.project.name === "desktop" ? [1440, 1100] : [390]
  for (const width of sizes) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto("/")
    const header = page.locator("header")
    const heading = page.getByRole("heading", {
      name: "Dashboard",
      exact: true,
    })
    const before = await header.boundingBox()
    const headingBefore = await heading.boundingBox()
    await page.getByRole("button", { name: "Search", exact: true }).click()
    await expect(
      page.getByRole("combobox", { name: "Search workspace" }),
    ).toBeFocused()
    const after = await header.boundingBox()
    const headingAfter = await heading.boundingBox()
    expect(after?.height).toBe(before?.height)
    expect(headingAfter?.y).toBe(headingBefore?.y)
    const field = await page
      .getByRole("combobox", { name: "Search workspace" })
      .boundingBox()
    if (!field) throw new Error("Search field is missing")
    expect(field.width).toBeGreaterThan(200)
    expect(field.x).toBeGreaterThanOrEqual(0)
    expect(field.x + field.width).toBeLessThanOrEqual(width)
  }
})

test("contacts can be filtered, created, annotated and archived", async ({
  page,
}) => {
  await page.goto("/showcase/crm/contacts")
  const heading = page.getByRole("heading", { name: "Contacts 8" })
  const titleSize = await heading.evaluate((element) =>
    parseFloat(getComputedStyle(element).fontSize),
  )
  const countSize = await heading
    .getByText("8", { exact: true })
    .evaluate((element) => parseFloat(getComputedStyle(element).fontSize))
  expect(countSize).toBeLessThan(titleSize)
  await page.getByRole("button", { name: "New contact", exact: true }).click()
  const form = page.getByRole("dialog", { name: "New contact" })
  await form.getByLabel("Full name").fill("Ada Rivers")
  await form.getByLabel("Email", { exact: true }).fill("ada@rivers.example")
  await form.getByLabel("Company").fill("Rivers Studio")
  await form.getByRole("button", { name: "Add contact" }).click()
  await expect(form).toBeHidden()
  await page.getByRole("textbox", { name: "Search contacts" }).fill("Ada")
  await page.getByRole("button", { name: /Ada Rivers/ }).click()
  const details = page.getByRole("dialog", { name: "Ada Rivers" })
  await details.getByLabel("Add a note").fill("Discuss the proposal next week.")
  await details.getByRole("button", { name: "Save note" }).click()
  await expect(
    details.getByText("Discuss the proposal next week."),
  ).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(details).toBeHidden()
  await page.getByRole("checkbox", { name: "Select Ada Rivers" }).check()
  await page.getByRole("button", { name: "Archive 1" }).click()
  await expect(page.getByRole("button", { name: /Ada Rivers/ })).toHaveCount(0)
  await chooseOption(page, "Filter by relationship", "Archived")
  await expect(page.getByRole("button", { name: /Ada Rivers/ })).toBeVisible()
})

for (const path of ["/showcase/crm", "/showcase/crm/contacts"]) {
  test(`${path} supports light/dark layouts without accessibility violations`, async ({
    page,
  }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    await page.goto(path)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
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
    }
    expect(errors).toEqual([])
  })
}

test("sidebar collapse keeps identity centered and mobile navigation works", async ({
  page,
}, testInfo) => {
  await page.goto("/showcase/crm")
  await page.getByRole("button", { name: "Toggle Sidebar" }).click()
  if (testInfo.project.name === "mobile") {
    const navigation = page.getByRole("dialog")
    await navigation
      .getByRole("link", { name: "Contacts", exact: true })
      .click()
    await expect(navigation).toBeHidden()
    await expect(page.getByRole("heading", { name: /Contacts/ })).toBeVisible()
  } else {
    await expect(
      page.locator('[data-state="collapsed"][data-slot="sidebar"]'),
    ).toBeVisible()
    const offsets = await page
      .locator('[data-slot="sidebar"]')
      .evaluate((sidebar) => {
        const rail = sidebar.getBoundingClientRect()
        const logo = sidebar
          .querySelector(".workspace-logo")
          ?.getBoundingClientRect()
        const avatar = sidebar
          .querySelector('[data-slot="sidebar-footer"] [data-slot="avatar"]')
          ?.getBoundingClientRect()
        if (!logo || !avatar) throw new Error("Workspace identity is missing")
        return [logo, avatar].map((box) =>
          Math.abs(box.x + box.width / 2 - rail.x - rail.width / 2),
        )
      })
    for (const offset of offsets) expect(offset).toBeLessThan(1)
  }
})
