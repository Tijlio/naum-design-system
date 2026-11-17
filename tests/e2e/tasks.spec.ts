import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import { chooseOption } from "./showcase-controls"
import { captureVisualEvidence } from "./visual-evidence"

test("follow-ups created from contact details complete into the persisted timeline", async ({
  page,
}) => {
  await page.goto("/showcase/crm/contacts?contact=c1")
  const details = page.getByRole("dialog", { name: "Emma Laurent" })
  await details
    .getByRole("region", { name: "Follow-up tasks" })
    .getByRole("button", { name: "New task", exact: true })
    .click()
  let form = page.getByRole("dialog", { name: "New task", exact: true })
  await form
    .getByLabel("Title", { exact: true })
    .fill("Call Emma about rollout")
  await form.getByRole("button", { name: "Due date", exact: true }).click()
  await page
    .locator('[data-slot="popover-content"]')
    .getByRole("button", { name: /18th, 2026/ })
    .click()
  await chooseOption(page, "Opportunity", "Studio North · Workspace rollout")
  await form.getByRole("button", { name: "Save task", exact: true }).click()
  await expect(form).toBeHidden()
  await details
    .getByRole("checkbox", {
      name: "Complete Call Emma about rollout",
      exact: true,
    })
    .check()
  await expect(
    details.getByRole("list", { name: "Contact timeline" }),
  ).toContainText("Task completed")
  await page.reload()
  await expect(
    page.getByRole("dialog", { name: "Emma Laurent" }).getByRole("checkbox", {
      name: "Complete Call Emma about rollout",
      exact: true,
    }),
  ).toBeChecked()
  await page.goto("/showcase/crm/tasks")
  await chooseOption(page, "Saved view", "Completed tasks")
  await page
    .getByRole("button", { name: "Call Emma about rollout", exact: true })
    .click()
  form = page.getByRole("dialog", { name: "Edit task", exact: true })
  await expect(
    form.getByRole("button", { name: "Due date", exact: true }),
  ).toContainText("18 Nov 2026")
  await form.getByRole("button", { name: "Delete", exact: true }).click()
  await page.getByRole("button", { name: "Undo", exact: true }).click()
  await expect(
    page.getByRole("button", { name: "Call Emma about rollout", exact: true }),
  ).toBeVisible()
})

test("opportunity follow-up submission does not submit the outer opportunity form", async ({
  page,
}) => {
  await page.goto("/showcase/crm/pipeline?deal=d2")
  const outer = page.getByRole("dialog", {
    name: "Edit opportunity",
    exact: true,
  })
  await outer
    .getByLabel("Title", { exact: true })
    .fill("Unsaved opportunity edit")
  await outer
    .getByRole("region", { name: "Follow-up tasks" })
    .getByRole("button", { name: "New task", exact: true })
    .click()
  const form = page.getByRole("dialog", { name: "New task", exact: true })
  await form
    .getByLabel("Title", { exact: true })
    .fill("Follow up on Forma proposal")
  await expect(
    form.getByRole("combobox", { name: "Contact", exact: true }),
  ).toContainText("Oliver Chen")
  await expect(
    form.getByRole("combobox", { name: "Opportunity", exact: true }),
  ).toContainText("Forma · Brand platform")
  await form.getByRole("button", { name: "Save task", exact: true }).click()
  await expect(outer).toBeVisible()
  await page.reload()
  await expect(
    page
      .getByRole("dialog", { name: "Edit opportunity", exact: true })
      .getByLabel("Title", { exact: true }),
  ).toHaveValue("Forma · Brand platform")
  await expect(
    page.getByRole("button", {
      name: "Edit task Follow up on Forma proposal",
      exact: true,
    }),
  ).toBeVisible()
  await page.keyboard.press("Escape")
  await page.getByRole("button", { name: "Search", exact: true }).click()
  await page
    .getByRole("combobox", { name: "Search workspace" })
    .fill("Follow up on Forma proposal")
  await page.keyboard.press("Enter")
  await expect(
    page.getByRole("dialog", { name: "Edit task", exact: true }),
  ).toBeVisible()
})

for (const theme of ["light", "dark"] as const)
  test(`tasks and timeline share Naum surfaces in ${theme} mode`, async ({
    page,
  }, testInfo) => {
    await page.clock.setFixedTime(new Date("2026-11-17T10:00:00"))
    await page.goto("/showcase/crm/tasks")
    if (theme === "dark")
      await page
        .getByRole("button", { name: "Toggle light or dark theme" })
        .click()
    await expect(
      page.getByRole("heading", { level: 1, name: /Tasks/ }),
    ).toBeVisible()
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
    await expect(page).toHaveScreenshot(`tasks-${theme}.png`, {
      fullPage: true,
      animations: "disabled",
    })
    await captureVisualEvidence(page, testInfo, `tasks-${theme}.png`, true)
    await chooseOption(page, "Saved view", "Overdue tasks")
    await page
      .getByRole("checkbox", {
        name: "Select Confirm workspace rollout",
        exact: true,
      })
      .check()
    await page.getByRole("button", { name: "Complete 1", exact: true }).click()
    await expect(
      page.getByRole("button", {
        name: "Confirm workspace rollout",
        exact: true,
      }),
    ).toHaveCount(0)
    await page.getByRole("button", { name: "Undo", exact: true }).click()
    await expect(
      page.getByRole("button", {
        name: "Confirm workspace rollout",
        exact: true,
      }),
    ).toBeVisible()
    await page.goto("/showcase/crm/contacts?contact=c1")
    await expect(
      page.getByRole("list", { name: "Contact timeline" }),
    ).toBeVisible()
    const timeline = page.getByRole("list", { name: "Contact timeline" })
    await timeline.scrollIntoViewIfNeeded()
    await expect(timeline).toHaveScreenshot(`contact-timeline-${theme}.png`, {
      animations: "disabled",
    })
    await captureVisualEvidence(
      timeline,
      testInfo,
      `contact-timeline-${theme}.png`,
    )
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([])
  })
