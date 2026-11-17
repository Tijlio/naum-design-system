import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import { chooseOption, chooseTime } from "./showcase-controls"

test("appointments can be created, edited, found through search and deleted", async ({
  page,
}) => {
  await page.goto("/showcase/calendar")
  await page
    .getByRole("button", { name: "New appointment", exact: true })
    .click()
  let dialog = page.getByRole("dialog", { name: "New appointment" })
  await dialog.getByLabel("Title", { exact: true }).fill("Rivers Studio review")
  await chooseTime(page, "Start", "15", "00")
  await chooseTime(page, "End", "14", "00")
  await dialog.getByRole("button", { name: "Save appointment" }).click()
  await expect(dialog.getByRole("alert")).toHaveText(
    "Choose an end after the start.",
  )
  await chooseTime(page, "End", "16", "00")
  await chooseOption(page, "Contact", "Emma Laurent")
  await dialog.getByRole("button", { name: "Save appointment" }).click()
  await expect(dialog).toBeHidden()
  await chooseOption(page, "Calendar view", "Agenda")
  await page
    .getByRole("button", { name: "Rivers Studio review, 15:00" })
    .click()
  dialog = page.getByRole("dialog", { name: "Edit appointment" })
  await dialog
    .getByLabel("Title", { exact: true })
    .fill("Rivers Studio follow-up")
  await dialog.getByRole("button", { name: "Save appointment" }).click()
  await page.getByRole("button", { name: "Search", exact: true }).click()
  await page
    .getByRole("combobox", { name: "Search workspace" })
    .fill("Rivers Studio follow-up")
  await page.keyboard.press("Enter")
  await expect(
    page.getByRole("dialog", { name: "Edit appointment" }),
  ).toBeVisible()
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Delete", exact: true })
    .click()
  await expect(
    page.getByRole("button", { name: "Rivers Studio follow-up, 15:00" }),
  ).toHaveCount(0)
  await page.getByRole("button", { name: "Undo", exact: true }).click()
  await expect(
    page.getByRole("button", { name: "Rivers Studio follow-up, 15:00" }),
  ).toBeVisible()
})

test("calendar views, date navigation and filters work", async ({ page }) => {
  await page.goto("/showcase/calendar")
  await chooseOption(page, "Calendar view", "Agenda")
  const event = page.getByRole("button", {
    name: "Studio North · Kick-off, 09:30",
  })
  await expect(event).toBeVisible()
  const agendaFits = await page
    .getByRole("region", { name: "Tuesday 17 November", exact: true })
    .evaluate((section) => {
      const boundary = section.getBoundingClientRect()
      const events = Array.from(section.querySelectorAll("button")).map(
        (button) => button.getBoundingClientRect(),
      )
      return events.every(
        (event, index) =>
          event.bottom <= boundary.bottom + 1 &&
          (index === 0 || event.top >= events[index - 1].bottom),
      )
    })
  expect(agendaFits).toBe(true)
  await page.getByRole("checkbox", { name: "Sales", exact: true }).uncheck()
  await expect(event).toHaveCount(0)
  await page.getByRole("checkbox", { name: "Sales", exact: true }).check()
  await expect(event).toBeVisible()
  await chooseOption(page, "Calendar view", "Month")
  await expect(
    page.getByRole("region", { name: "Month calendar" }),
  ).toBeVisible()
  await page
    .getByRole("button", { name: "Open Tuesday 17 November 2026" })
    .click()
  await expect(page.getByLabel("Calendar view")).toContainText("Day")
  await expect(
    page.getByRole("region", { name: "Calendar time grid" }),
  ).toBeVisible()
  await page.getByRole("button", { name: "Next period", exact: true }).click()
  await expect(
    page.getByRole("button", { name: "Forma · Proposal review, 10:00" }),
  ).toBeVisible()
})

test("calendar and event editor are accessible in both themes", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/showcase/calendar")
  await expect(
    page.getByRole("checkbox", { name: "Sales", exact: true }),
  ).toBeChecked()
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
  await page
    .getByRole("button", { name: "New appointment", exact: true })
    .click()
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([])
  await page.getByRole("button", { name: "Start", exact: true }).click()
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([])
  await page.getByRole("button", { name: "Done", exact: true }).click()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  expect(errors).toEqual([])
})

test("all-day appointments keep their inclusive display date when edited", async ({
  page,
}) => {
  await page.goto("/showcase/calendar?event=e7")
  const dialog = page.getByRole("dialog", { name: "Edit appointment" })
  await expect(dialog.getByLabel("Start", { exact: true })).toContainText(
    "19 Nov 2026",
  )
  await expect(dialog.getByLabel("End", { exact: true })).toContainText(
    "19 Nov 2026",
  )
  await dialog.getByRole("button", { name: "Save appointment" }).click()
  await chooseOption(page, "Calendar view", "Agenda")
  await expect(
    page.getByRole("button", { name: "Team offsite, all day" }),
  ).toHaveCount(1)
})

test("week events can be moved with desktop drag and drop", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name === "mobile",
    "Touch users edit the date/time in the accessible editor.",
  )
  await page.goto("/showcase/calendar")
  const event = page.getByRole("button", {
    name: "Studio North · Kick-off, 09:30",
  })
  const target = page.getByRole("button", {
    name: "New appointment Wednesday 18 November at 14:00",
    exact: true,
  })
  await event.dragTo(target, { targetPosition: { x: 10, y: 2 } })
  await expect(
    page.getByText("Appointment moved", { exact: true }),
  ).toBeVisible()
  await page
    .getByRole("button", { name: "Studio North · Kick-off, 14:00" })
    .click()
  await expect(
    page.getByRole("dialog").getByLabel("Start", { exact: true }),
  ).toContainText("18 Nov 2026, 14:00")
})

test("appointments resize by dragging or by keyboard", async ({
  page,
}, testInfo) => {
  await page.goto("/showcase/calendar")
  await chooseOption(page, "Calendar view", "Day")
  const handle = page.getByRole("button", {
    name: "Resize end Studio North · Kick-off",
    exact: true,
  })
  if (testInfo.project.name === "desktop") {
    await handle.scrollIntoViewIfNeeded()
    const bounds = await handle.boundingBox()
    if (!bounds) throw new Error("Resize handle is missing")
    await page.mouse.move(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2,
    )
    await page.mouse.down()
    await page.mouse.move(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2 + 32,
      { steps: 4 },
    )
    await page.keyboard.press("Escape")
    await page.mouse.up()
    await expect(
      page.getByRole("button", { name: "Studio North · Kick-off, 09:30" }),
    ).toContainText("09:30–10:30")
    await page.mouse.move(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2,
    )
    await page.mouse.down()
    await page.mouse.move(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2 + 32,
      { steps: 4 },
    )
    await page.mouse.up()
  } else {
    await handle.press("ArrowDown")
    await handle.press("ArrowDown")
  }
  await page
    .getByRole("button", { name: "Studio North · Kick-off, 09:30" })
    .click()
  await expect(
    page.getByRole("button", { name: "End", exact: true }),
  ).toContainText("11:00")
  await expect(
    page.locator('input[type="datetime-local"], input[type="date"]'),
  ).toHaveCount(0)
  await expect(page.locator("select:visible")).toHaveCount(0)
})
