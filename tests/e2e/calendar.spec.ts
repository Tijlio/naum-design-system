import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

test("appointments can be created, edited, found through search and deleted", async ({
  page,
}) => {
  await page.goto("/showcase/calendar")
  await page
    .getByRole("button", { name: "New appointment", exact: true })
    .click()
  let dialog = page.getByRole("dialog", { name: "New appointment" })
  await dialog.getByLabel("Title", { exact: true }).fill("Rivers Studio review")
  await dialog.getByLabel("Start", { exact: true }).fill("2026-11-17T15:00")
  await dialog.getByLabel("End", { exact: true }).fill("2026-11-17T14:00")
  await dialog.getByRole("button", { name: "Save appointment" }).click()
  await expect(dialog.getByRole("alert")).toHaveText(
    "Choose an end after the start.",
  )
  await dialog.getByLabel("End", { exact: true }).fill("2026-11-17T16:00")
  await dialog.getByLabel("Contact", { exact: true }).selectOption("c1")
  await dialog.getByRole("button", { name: "Save appointment" }).click()
  await expect(dialog).toBeHidden()
  await page.getByLabel("Calendar view").selectOption("Agenda")
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
  await page.getByLabel("Calendar view").selectOption("Agenda")
  const event = page.getByRole("button", {
    name: "Studio North · Kick-off, 09:30",
  })
  await expect(event).toBeVisible()
  await page.getByRole("checkbox", { name: "Sales", exact: true }).uncheck()
  await expect(event).toHaveCount(0)
  await page.getByRole("checkbox", { name: "Sales", exact: true }).check()
  await expect(event).toBeVisible()
  await page.getByLabel("Calendar view").selectOption("Month")
  await expect(
    page.getByRole("region", { name: "Month calendar" }),
  ).toBeVisible()
  await page
    .getByRole("button", { name: "Open Tuesday 17 November 2026" })
    .click()
  await expect(page.getByLabel("Calendar view")).toHaveValue("Day")
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
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  expect(errors).toEqual([])
})

test("all-day appointments keep their inclusive display date when edited", async ({
  page,
}) => {
  await page.goto("/showcase/calendar?event=e7")
  const dialog = page.getByRole("dialog", { name: "Edit appointment" })
  await expect(dialog.getByLabel("Start", { exact: true })).toHaveValue(
    "2026-11-19",
  )
  await expect(dialog.getByLabel("End", { exact: true })).toHaveValue(
    "2026-11-19",
  )
  await dialog.getByRole("button", { name: "Save appointment" }).click()
  await page.getByLabel("Calendar view").selectOption("Agenda")
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
  ).toHaveValue("2026-11-18T14:00")
})
