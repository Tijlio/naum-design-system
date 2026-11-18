import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"
import { parseWorkspace } from "../../src/components/showcase/workspace-schema"
import { chooseOption } from "./showcase-controls"
import { settleAnimations } from "./ui-stability"
import { captureVisualEvidence } from "./visual-evidence"

const stored = async (page: Page) => {
  const raw = await page.evaluate(() =>
    localStorage.getItem("naum-demo-workspace"),
  )
  const data = raw ? parseWorkspace(raw) : null
  if (!data) throw new Error("Expected valid persisted workspace")
  return data
}
for (const theme of ["light", "dark"]) {
  test(`contact to opportunity to task to appointment survives reload and undo in ${theme} mode`, async ({
    page,
  }, testInfo) => {
    await page.goto("/showcase/crm/contacts")
    if (theme === "dark")
      await page
        .getByRole("button", { name: "Toggle light or dark theme" })
        .click()
    await page.getByRole("button", { name: "New contact", exact: true }).click()
    let dialog = page.getByRole("dialog", { name: "New contact", exact: true })
    await dialog.getByLabel("Full name", { exact: true }).fill("Riley Morgan")
    await dialog.getByLabel("Email", { exact: true }).fill("riley@example.test")
    await dialog.getByLabel("Company", { exact: true }).fill("Riley Studio")
    await dialog
      .getByRole("button", { name: "Add contact", exact: true })
      .click()
    await page
      .getByRole("button", { name: "View contact", exact: true })
      .click()
    dialog = page.getByRole("dialog", { name: "Riley Morgan", exact: true })
    await dialog
      .getByRole("button", { name: "New opportunity", exact: true })
      .click()
    let editor = page.getByRole("dialog", {
      name: "New opportunity",
      exact: true,
    })
    await expect(
      editor.getByRole("combobox", { name: "Contact", exact: true }),
    ).toContainText("Riley Morgan")
    await editor.getByLabel("Title", { exact: true }).fill("Riley launch")
    await editor.getByLabel("Value (€)", { exact: true }).fill("1250.50")
    await editor
      .getByRole("button", { name: "Save opportunity", exact: true })
      .click()
    await page
      .getByRole("button", { name: "View opportunity", exact: true })
      .click()
    editor = page.getByRole("dialog", { name: "Edit opportunity", exact: true })
    await editor
      .getByRole("region", { name: "Follow-up tasks" })
      .getByRole("button", { name: "New task", exact: true })
      .click()
    editor = page.getByRole("dialog", { name: "New task", exact: true })
    await expect(
      editor.getByRole("combobox", { name: "Contact", exact: true }),
    ).toContainText("Riley Morgan")
    await expect(
      editor.getByRole("combobox", { name: "Opportunity", exact: true }),
    ).toContainText("Riley launch")
    await editor
      .getByLabel("Title", { exact: true })
      .fill("Discuss Riley launch")
    await editor.getByRole("button", { name: "Due date", exact: true }).click()
    const picker = page.locator('[data-slot="popover-content"]')
    await picker.getByRole("button", { name: /next month/i }).click()
    await picker
      .getByRole("button", {
        name: "Wednesday, December 2nd, 2026",
        exact: true,
      })
      .click()
    await editor.getByRole("button", { name: "Save task", exact: true }).click()
    await page.getByRole("button", { name: "View task", exact: true }).click()
    editor = page.getByRole("dialog", { name: "Edit task", exact: true })
    await editor
      .getByRole("button", { name: "Schedule appointment", exact: true })
      .click()
    editor = page.getByRole("dialog", { name: "New appointment", exact: true })
    await expect(editor.getByLabel("Title", { exact: true })).toHaveValue(
      "Discuss Riley launch",
    )
    await expect(
      editor.getByRole("button", { name: "Start", exact: true }),
    ).toContainText("2 Dec 2026, 09:00")
    await expect(
      editor.getByRole("combobox", { name: "Contact", exact: true }),
    ).toContainText("Riley Morgan")
    await expect(
      editor.getByRole("combobox", { name: "Opportunity", exact: true }),
    ).toContainText("Riley launch")
    await expect(
      editor.getByRole("combobox", { name: "Task", exact: true }),
    ).toContainText("Discuss Riley launch")
    await editor
      .getByRole("button", { name: "Save appointment", exact: true })
      .click()
    await page
      .getByRole("button", { name: "View appointment", exact: true })
      .click()
    editor = page.getByRole("dialog", { name: "Edit appointment", exact: true })
    await expect(editor).toBeVisible()
    await page.reload()
    await expect(editor).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "December 2026", exact: true }),
    ).toBeVisible()
    await settleAnimations(page)
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([])
    await captureVisualEvidence(
      editor,
      testInfo,
      `linked-appointment-${theme}.png`,
    )
    expect(
      await page
        .locator("body")
        .evaluate((body) => body.scrollWidth <= body.clientWidth),
    ).toBe(true)
    const data = await stored(page)
    const task = data.tasks.find(
      (task) => task.title === "Discuss Riley launch",
    )
    const event = data.appointments.find(
      (event) => event.title === "Discuss Riley launch",
    )
    if (!task || !event) throw new Error("Missing flow records")
    expect(event).toMatchObject({
      contactId: task.contactId,
      dealId: task.dealId,
      taskId: task.id,
    })
    expect(task.completed).toBe(false)
    await editor
      .getByRole("link", { name: "Opportunity: Riley launch", exact: true })
      .click()
    editor = page.getByRole("dialog", { name: "Edit opportunity", exact: true })
    await editor.getByRole("button", { name: "Delete", exact: true }).click()
    await page.getByRole("button", { name: "Undo", exact: true }).click()
    const restored = await stored(page)
    expect(restored.tasks.find((entry) => entry.id === task.id)?.dealId).toBe(
      task.dealId,
    )
    expect(
      restored.appointments.find((entry) => entry.id === event.id),
    ).toMatchObject({ dealId: task.dealId, taskId: task.id })
    await page.goto(`/showcase/crm/tasks?task=${task.id}`)
    editor = page.getByRole("dialog", { name: "Edit task", exact: true })
    await expect(
      editor.getByRole("region", { name: "Related appointments" }),
    ).toContainText(event.title)
    await editor
      .getByRole("link", { name: "Contact: Riley Morgan", exact: true })
      .focus()
    await page.keyboard.press("Enter")
    await expect(
      page.getByRole("list", { name: "Contact timeline" }),
    ).toContainText("Appointment added")
  })
}

test("validation and dismissal retain drafts and focus, then discard cleanly", async ({
  page,
}, testInfo) => {
  await page.goto("/showcase/crm/contacts")
  await page.getByRole("button", { name: "New contact", exact: true }).click()
  const dialog = page.getByRole("dialog", { name: "New contact", exact: true })
  await dialog.getByRole("button", { name: "Add contact", exact: true }).click()
  await expect(dialog.getByLabel("Full name", { exact: true })).toBeFocused()
  await expect(dialog.getByRole("alert")).toHaveCount(3)
  await dialog.getByLabel("Full name", { exact: true }).fill("Draft contact")
  await dialog.getByLabel("Email", { exact: true }).fill("broken-email")
  await dialog.getByLabel("Company", { exact: true }).fill("Draft studio")
  await dialog.getByRole("button", { name: "Add contact", exact: true }).click()
  await expect(dialog.getByLabel("Email", { exact: true })).toBeFocused()
  await expect(dialog.getByRole("alert")).toHaveText(
    "Enter a valid email address.",
  )
  await captureVisualEvidence(dialog, testInfo, "contact-field-validation.png")
  await page.keyboard.press("Escape")
  const discard = page.getByRole("alertdialog", {
    name: "Discard changes?",
    exact: true,
  })
  await expect(discard).toBeVisible()
  await discard
    .getByRole("button", { name: "Keep editing", exact: true })
    .click()
  await expect(dialog.getByLabel("Full name", { exact: true })).toHaveValue(
    "Draft contact",
  )
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click()
  await discard
    .getByRole("button", { name: "Discard changes", exact: true })
    .click()
  await expect(dialog).toBeHidden()
  await expect(
    page.getByRole("button", { name: "New contact", exact: true }),
  ).toBeFocused()
  await page.getByRole("button", { name: "New contact", exact: true }).click()
  await expect(dialog.getByLabel("Full name", { exact: true })).toHaveValue("")
})

test("an opportunity deleted in another tab produces a recoverable field error", async ({
  page,
  context,
}) => {
  await page.goto("/showcase/crm/tasks?task=t2")
  const editor = page.getByRole("dialog", { name: "Edit task", exact: true })
  await editor.getByLabel("Title", { exact: true }).fill("Keep this follow-up")
  const other = await context.newPage()
  try {
    await other.goto("/showcase/crm/pipeline?deal=d1")
    await other
      .getByRole("dialog", { name: "Edit opportunity", exact: true })
      .getByRole("button", { name: "Delete", exact: true })
      .click()
    await expect(
      editor.getByRole("combobox", { name: "Opportunity", exact: true }),
    ).toContainText("Choose an opportunity")
    await editor.getByRole("button", { name: "Save task", exact: true }).click()
    await expect(editor.getByRole("alert")).toHaveText(
      "Choose an opportunity belonging to this contact.",
    )
    await expect(
      editor.getByRole("combobox", { name: "Opportunity", exact: true }),
    ).toBeFocused()
    await expect(editor.getByLabel("Title", { exact: true })).toHaveValue(
      "Keep this follow-up",
    )
    await chooseOption(page, "Opportunity", "No opportunity")
    await editor.getByRole("button", { name: "Save task", exact: true }).click()
    await expect(editor).toBeHidden()
    await expect(
      page.getByRole("button", { name: "New task", exact: true }),
    ).toBeFocused()
    expect(
      (await stored(page)).tasks.find((task) => task.id === "t2"),
    ).toMatchObject({ title: "Keep this follow-up" })
    expect(
      (await stored(page)).tasks.find((task) => task.id === "t2")?.dealId,
    ).toBeUndefined()
  } finally {
    await other.close()
  }
})

test("changing an appointment contact clears incompatible opportunity and task context", async ({
  page,
}) => {
  await page.goto("/showcase/crm/tasks?task=t2")
  await page
    .getByRole("dialog", { name: "Edit task", exact: true })
    .getByRole("button", { name: "Schedule appointment", exact: true })
    .click()
  const editor = page.getByRole("dialog", {
    name: "New appointment",
    exact: true,
  })
  await chooseOption(page, "Contact", "Oliver Chen")
  await expect(
    editor.getByRole("combobox", { name: "Opportunity", exact: true }),
  ).toContainText("No opportunity")
  await expect(
    editor.getByRole("combobox", { name: "Task", exact: true }),
  ).toContainText("No task")
  await editor
    .getByRole("button", { name: "Save appointment", exact: true })
    .click()
  await expect(editor).toBeHidden()
  const saved = (await stored(page)).appointments.find(
    (event) => event.title === "Confirm workspace rollout",
  )
  expect(saved).toMatchObject({ contactId: "c2" })
  expect(saved?.dealId).toBeUndefined()
  expect(saved?.taskId).toBeUndefined()
})

test("missing record links offer recovery without clearing unrelated view parameters", async ({
  page,
}) => {
  for (const [path, key, record] of [
    ["/showcase/crm/contacts", "contact", "Contact"],
    ["/showcase/crm/pipeline?layout=table", "deal", "Opportunity"],
    ["/showcase/crm/tasks", "task", "Task"],
    ["/showcase/calendar", "event", "Appointment"],
  ]) {
    await page.goto(`${path}${path.includes("?") ? "&" : "?"}${key}=removed`)
    await expect(
      page
        .getByRole("status")
        .filter({ hasText: `${record} is no longer available.` }),
    ).toContainText(`${record} is no longer available.`)
    await page
      .getByRole("button", { name: "Return to overview", exact: true })
      .click()
    await expect(page).not.toHaveURL(new RegExp(`${key}=`))
    if (key === "deal") await expect(page).toHaveURL(/layout=table/)
  }
})

test("returning to the underlying contact protects a draft and closes the child editor", async ({
  page,
}) => {
  await page.goto("/showcase/crm/contacts?contact=c1")
  const details = page.getByRole("dialog", {
    name: "Emma Laurent",
    exact: true,
  })
  await details
    .getByRole("button", { name: "New opportunity", exact: true })
    .click()
  const editor = page.getByRole("dialog", {
    name: "New opportunity",
    exact: true,
  })
  await editor.getByLabel("Title", { exact: true }).fill("Draft opportunity")
  await editor
    .getByRole("link", { name: "Contact: Emma Laurent", exact: true })
    .click()
  const discard = page.getByRole("alertdialog", {
    name: "Discard changes?",
    exact: true,
  })
  await discard
    .getByRole("button", { name: "Keep editing", exact: true })
    .click()
  await expect(editor.getByLabel("Title", { exact: true })).toHaveValue(
    "Draft opportunity",
  )
  await editor
    .getByRole("link", { name: "Contact: Emma Laurent", exact: true })
    .click()
  await discard
    .getByRole("button", { name: "Discard changes", exact: true })
    .click()
  await expect(editor).toBeHidden()
  await expect(details).toBeVisible()
  await expect(
    details.getByRole("button", { name: "New opportunity", exact: true }),
  ).toBeFocused()
  expect(
    await page.evaluate(() => localStorage.getItem("naum-demo-workspace")),
  ).toBeNull()
})

test("contact notes save repeatedly in place and archived contacts cannot start new records", async ({
  page,
}) => {
  await page.goto("/showcase/crm/contacts?contact=c1")
  const details = page.getByRole("dialog", {
    name: "Emma Laurent",
    exact: true,
  })
  const note = details.getByLabel("Add a note", { exact: true })
  for (const text of ["First workflow note", "Second workflow note"]) {
    await note.fill(text)
    await details
      .getByRole("button", { name: "Save note", exact: true })
      .click()
    await expect(note).toHaveValue("")
    await expect(
      details.getByRole("list", { name: "Contact timeline" }),
    ).toContainText(text)
  }
  await chooseOption(page, "Relationship", "Archived")
  for (const label of ["New opportunity", "New task", "New appointment"]) {
    await expect(
      details.getByRole("button", { name: label, exact: true }),
    ).toBeDisabled()
  }
  await page.keyboard.press("Escape")
  await expect(details).toBeHidden()
  expect(
    (await stored(page)).contacts
      .find((contact) => contact.id === "c1")
      ?.notes.slice(0, 2)
      .map((note) => note.text),
  ).toEqual(["Second workflow note", "First workflow note"])
})
