import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import { chooseOption } from "./showcase-controls"

const navigationAppearance = (element: Element) => {
  const style = getComputedStyle(element)
  const bounds = element.getBoundingClientRect()
  return {
    width: bounds.width,
    height: bounds.height,
    border: style.borderWidth,
    radius: style.borderRadius,
    background: style.backgroundColor,
    clip: style.backgroundClip,
    shadow: style.boxShadow,
    blur: style.backdropFilter,
  }
}

test("search expands, filters results and restores focus", async ({ page }) => {
  await page.goto("/")
  const trigger = page.getByRole("button", { name: "Search", exact: true })
  await trigger.click()
  const input = page.getByRole("combobox", { name: "Search workspace" })
  await expect(input).toBeFocused()
  await expect(input).toBeInViewport()
  await expect(
    page.getByRole("option", { name: "Calendar", exact: true }),
  ).toBeInViewport()
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
  await page.getByRole("searchbox", { name: "Search contacts" }).fill("Ada")
  await page.getByRole("button", { name: /Ada Rivers/ }).click()
  const details = page.getByRole("dialog", { name: "Ada Rivers" })
  await expect(
    details.getByText("Last contacted", { exact: true }),
  ).toBeVisible()
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
      await expect(page.getByRole("main")).toHaveCount(1)
      expect(
        await page.locator(".workspace-header").evaluate((header) => {
          const style = getComputedStyle(header)
          return {
            background: style.backgroundColor,
            image: style.backgroundImage,
            border: style.borderBottomWidth,
            blur: style.backdropFilter,
          }
        }),
      ).toEqual({
        background: "rgba(0, 0, 0, 0)",
        image: "none",
        border: "0px",
        blur: "none",
      })
      expect(
        await page
          .locator('[data-slot="table-container"]')
          .evaluateAll((tables) =>
            tables.every((table) => table.scrollWidth <= table.clientWidth + 1),
          ),
      ).toBe(true)
      if (path === "/showcase/crm") {
        const trend = page.getByRole("img", {
          name: "Down 8% compared with the previous period",
        })
        await page
          .getByRole("button", { name: "Open Pipeline value", exact: true })
          .focus()
        await page.keyboard.press("Tab")
        await expect(trend).toBeFocused()
        await expect(page.locator('[data-slot="tooltip-content"]')).toHaveText(
          "Down 8% compared with the previous period",
        )
        await page.keyboard.press("Escape")
      }
    }
    expect(errors).toEqual([])
  })
}

test("compact layouts and form actions remain reachable", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 })
  for (const route of [
    "/",
    "/preview",
    "/showcase/crm",
    "/showcase/calendar",
    "/showcase/crm/pipeline",
    "/docs",
    "/showcase/crm/contacts",
  ]) {
    await page.goto(route)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    expect(
      await page
        .locator("body")
        .evaluate((body) => body.scrollWidth <= body.clientWidth),
    ).toBe(true)
  }
  await page.getByRole("button", { name: "New contact", exact: true }).click()
  const form = page.getByRole("dialog", { name: "New contact" })
  await form.getByLabel("Full name").fill("Lee Morgan")
  await form.getByLabel("Email", { exact: true }).fill("lee@naum.example")
  await form.getByLabel("Company").fill("Naum Studio")
  const bounds = await form.boundingBox()
  if (!bounds) throw new Error("Contact form is missing")
  expect(bounds.width).toBeLessThanOrEqual(320)
  expect(bounds.height).toBeLessThanOrEqual(640)
  await form.getByRole("button", { name: "Add contact", exact: true }).click()
  await expect(form).toBeHidden()
})

test("sidebar collapse keeps identity centered and mobile navigation works", async ({
  page,
}, testInfo) => {
  await page.goto("/showcase/crm")
  await page.getByRole("button", { name: "Toggle Sidebar" }).click()
  if (testInfo.project.name === "mobile") {
    const navigation = page.getByRole("dialog")
    await expect(navigation).toHaveClass(/naum-app-overlay/)
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
    const calendar = page.getByRole("link", { name: "Calendar", exact: true })
    const centering = await calendar.evaluate((element) => {
      const button = element.getBoundingClientRect()
      const rail = element
        .closest('[data-slot="sidebar"]')
        ?.getBoundingClientRect()
      const icon = element.querySelector("svg")?.getBoundingClientRect()
      if (!rail || !icon) throw new Error("Navigation geometry is missing")
      return [
        Math.abs(button.x + button.width / 2 - rail.x - rail.width / 2),
        Math.abs(button.x + button.width / 2 - icon.x - icon.width / 2),
      ]
    })
    for (const offset of centering) expect(offset).toBeLessThan(1)
    const applicationStyle = await calendar.evaluate(navigationAppearance)
    await page.goto("/")
    const bentoStyle = await page
      .getByRole("button", { name: "Employees", exact: true })
      .evaluate(navigationAppearance)
    expect(applicationStyle).toEqual(bentoStyle)
  }
})
