import { expect, test, type Locator, type Page } from "@playwright/test"

const tabTo = async (page: Page, target: Locator, key = "Tab") => {
  await expect(target).toBeVisible()
  for (let step = 0; step < 65; step++) {
    if (await target.evaluate((element) => element === document.activeElement))
      return
    await page.keyboard.press(key)
  }
  await expect(target).toBeFocused()
}

const activate = async (page: Page, target: Locator) => {
  await tabTo(page, target)
  await page.keyboard.press("Enter")
}

const enter = async (page: Page, field: Locator, value: string) => {
  await tabTo(page, field)
  await page.keyboard.press("ControlOrMeta+a")
  await page.keyboard.insertText(value)
}

test("complete customer flow using keyboard navigation and notification actions", async ({
  page,
}) => {
  await page.goto("/showcase/crm")
  await page.keyboard.press("Control+k")
  await page.keyboard.insertText("All contacts")
  await page.keyboard.press("Enter")
  await expect(page.getByRole("heading", { name: /^Contacts/ })).toBeFocused()
  await activate(
    page,
    page.getByRole("button", { name: "New contact", exact: true }),
  )
  const contact = page.getByRole("dialog", { name: "New contact", exact: true })
  await enter(page, contact.getByLabel("Full name"), "Keyboard Customer")
  await enter(page, contact.getByLabel("Email"), "keyboard@example.test")
  await enter(page, contact.getByLabel("Company"), "Keyboard Studio")
  await activate(page, contact.getByRole("button", { name: "Add contact" }))
  await expect(contact).toBeHidden()
  await page.keyboard.press("Alt+t")
  await activate(
    page,
    page.getByRole("button", { name: "View contact", exact: true }),
  )
  const sheet = page.getByRole("dialog", {
    name: "Keyboard Customer",
    exact: true,
  })
  await expect
    .poll(() =>
      sheet.evaluate((panel) => panel.contains(document.activeElement)),
    )
    .toBe(true)
  const newOpportunity = sheet.getByRole("button", {
    name: "New opportunity",
    exact: true,
  })
  await activate(page, newOpportunity)
  const opportunity = page.getByRole("dialog", {
    name: "New opportunity",
    exact: true,
  })
  await enter(page, opportunity.getByLabel("Title"), "Keyboard rollout")
  await page.keyboard.press("Escape")
  const discard = page.getByRole("alertdialog", { name: "Discard changes?" })
  await expect(
    discard.getByRole("button", { name: "Keep editing" }),
  ).toBeFocused()
  await page.keyboard.press("Escape")
  await expect(opportunity.getByLabel("Title")).toBeFocused()
  await expect(opportunity.getByLabel("Title")).toHaveValue("Keyboard rollout")
  await activate(
    page,
    opportunity.getByRole("button", { name: "Save opportunity" }),
  )
  await expect(newOpportunity).toBeFocused()
  await activate(
    page,
    sheet.getByRole("button", { name: "View opportunity", exact: true }),
  )
  const savedOpportunity = page.getByRole("dialog", {
    name: "Edit opportunity",
    exact: true,
  })
  await expect(savedOpportunity.getByLabel("Title")).toBeFocused()
  await activate(
    page,
    savedOpportunity.getByRole("button", { name: "New task", exact: true }),
  )
  const task = page.getByRole("dialog", { name: "New task", exact: true })
  await enter(page, task.getByLabel("Title"), "Keyboard follow-up")
  await activate(page, task.getByRole("button", { name: "Save task" }))
  await expect(savedOpportunity.getByRole("status")).toContainText(
    "Task created",
  )
  await activate(
    page,
    savedOpportunity.getByRole("button", { name: "View task", exact: true }),
  )
  const savedTask = page.getByRole("dialog", { name: "Edit task", exact: true })
  await activate(
    page,
    savedTask.getByRole("button", { name: "Schedule appointment" }),
  )
  const appointment = page.getByRole("dialog", {
    name: "New appointment",
    exact: true,
  })
  await expect(appointment.getByLabel("Title")).toHaveValue(
    "Keyboard follow-up",
  )
  await activate(
    page,
    appointment.getByRole("button", { name: "Save appointment" }),
  )
  await expect(savedTask.getByRole("status")).toContainText("Appointment added")
  await activate(
    page,
    savedTask.getByRole("button", { name: "View appointment", exact: true }),
  )
  const savedAppointment = page.getByRole("dialog", {
    name: "Edit appointment",
    exact: true,
  })
  await expect(savedAppointment.getByLabel("Title")).toBeFocused()
  const start = savedAppointment.getByRole("button", {
    name: "Start",
    exact: true,
  })
  await activate(page, start)
  await expect(
    page.getByRole("dialog", { name: "Start", exact: true }),
  ).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(start).toBeFocused()
  await expect(savedAppointment).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(savedAppointment).toBeHidden()
  await expect(
    page.getByRole("button", { name: "New appointment", exact: true }),
  ).toBeFocused()
})

test("task changes and Undo are reachable inside the contact sheet", async ({
  page,
}) => {
  await page.goto("/showcase/crm/contacts?contact=c1")
  const sheet = page.getByRole("dialog", { name: "Emma Laurent", exact: true })
  const task = sheet.getByRole("checkbox", {
    name: "Complete Confirm workspace rollout",
  })
  await tabTo(page, task)
  await page.keyboard.press("Space")
  await expect(task).toBeChecked()
  await expect(
    sheet.getByRole("status").filter({ hasText: "Task completed" }),
  ).toBeVisible()
  await activate(page, sheet.getByRole("button", { name: "Undo", exact: true }))
  await expect(task).not.toBeChecked()
  await expect(task).toBeFocused()
  await expect(
    sheet.getByRole("status").filter({ hasText: "Task change undone" }),
  ).toBeVisible()
})

test("keyboard resizes and reschedules an appointment", async ({ page }) => {
  await page.goto("/showcase/calendar")
  const view = page.getByRole("combobox", {
    name: "Calendar view",
    exact: true,
  })
  await activate(page, view)
  const week = page.getByRole("option", { name: "Week", exact: true })
  await expect(week).toBeVisible()
  await page.keyboard.press("Home")
  await expect(week).toBeFocused()
  await page.keyboard.press("ArrowDown")
  await expect(
    page.getByRole("option", { name: "Day", exact: true }),
  ).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(view).toContainText("Day")
  const handle = page.getByRole("button", {
    name: "Resize end Studio North · Kick-off",
  })
  await tabTo(page, handle)
  await page.keyboard.press("ArrowDown")
  await expect(
    page.getByText("Studio North · Kick-off, 09:30–10:45"),
  ).toBeVisible()
  await expect(handle).toBeFocused()
  await page.keyboard.press("Enter")
  const editor = page.getByRole("dialog", { name: "Edit appointment" })
  await activate(
    page,
    editor.getByRole("button", { name: "Start", exact: true }),
  )
  const picker = page.getByRole("dialog", { name: "Start", exact: true })
  const selected = picker.getByRole("button", { name: /November 17th, 2026/ })
  await tabTo(page, selected)
  await page.keyboard.press("ArrowRight")
  await expect(
    picker.getByRole("button", { name: /November 18th, 2026/ }),
  ).toBeFocused()
  await page.keyboard.press("Enter")
  await activate(
    page,
    picker.getByRole("button", { name: "Done", exact: true }),
  )
  await expect(
    editor.getByRole("button", { name: "Start", exact: true }),
  ).toBeFocused()
  await expect(
    editor.getByRole("button", { name: "End", exact: true }),
  ).toHaveAccessibleDescription("18 Nov 2026, 10:45")
  await activate(page, editor.getByRole("button", { name: "Save appointment" }))
  await expect(editor).toBeHidden()
  await expect(
    page.getByRole("button", { name: "Studio North · Kick-off, 09:30" }),
  ).toBeVisible()
})
