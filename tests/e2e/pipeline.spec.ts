import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import { chooseOption } from "./showcase-controls"
import { captureVisualEvidence } from "./visual-evidence"

const title = "Rivers Studio rollout"
const opportunity = (page: import("@playwright/test").Page) =>
  page.getByRole("group", { name: title, exact: true })

test("opportunities can be created, moved, edited, persisted, found and deleted with undo", async ({
  page,
}) => {
  await page.goto("/showcase/crm/pipeline")
  await page
    .getByRole("button", { name: "New opportunity", exact: true })
    .click()
  let dialog = page.getByRole("dialog", { name: "New opportunity" })
  await dialog.getByLabel("Title", { exact: true }).fill(title)
  await dialog.getByLabel("Value (€)", { exact: true }).fill("5000")
  await chooseOption(page, "Contact", "Emma Laurent")
  await chooseOption(page, "Stage", "Proposal")
  await dialog.getByRole("button", { name: "Save opportunity" }).click()
  await expect(
    page
      .getByRole("region", { name: "Proposal opportunities", exact: true })
      .getByRole("group", { name: title, exact: true }),
  ).toBeVisible()
  await chooseOption(page, `Move ${title} to`, "Negotiation")
  await expect(
    page
      .getByRole("region", { name: "Negotiation opportunities", exact: true })
      .getByRole("group", { name: title, exact: true }),
  ).toBeVisible()
  await page.reload()
  await expect(opportunity(page).getByRole("combobox")).toContainText(
    "Negotiation",
  )
  await opportunity(page)
    .getByRole("button", { name: `Edit ${title}` })
    .click()
  dialog = page.getByRole("dialog", { name: "Edit opportunity" })
  await dialog.getByLabel("Value (€)", { exact: true }).fill("7500")
  await chooseOption(page, "Stage", "Won")
  await dialog.getByRole("button", { name: "Save opportunity" }).click()
  await expect(
    page.getByRole("region", { name: "Won opportunities", exact: true }),
  ).toContainText("€35,500")
  await page.goto("/showcase/crm")
  const won = page
    .locator('[data-slot="card"]')
    .filter({ has: page.getByText("Won this month", { exact: true }) })
  await expect(won).toContainText("35,500")
  await page.getByRole("button", { name: "Search", exact: true }).click()
  await page.getByRole("combobox", { name: "Search workspace" }).fill(title)
  await page.keyboard.press("Enter")
  dialog = page.getByRole("dialog", { name: "Edit opportunity" })
  await expect(dialog.getByLabel("Value (€)", { exact: true })).toHaveValue(
    "7500",
  )
  await dialog.getByRole("button", { name: "Delete", exact: true }).click()
  await expect(opportunity(page)).toHaveCount(0)
  await page.getByRole("button", { name: "Undo", exact: true }).click()
  await expect(opportunity(page)).toBeVisible()
})

test("desktop dragging moves an opportunity and undo restores its stage", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name === "mobile",
    "Touch and keyboard movement is covered by the Move to selector.",
  )
  await page.goto("/showcase/crm/pipeline")
  const card = page.getByRole("group", {
    name: "Studio North · Workspace rollout",
    exact: true,
  })
  const won = page.getByRole("region", {
    name: "Won opportunities",
    exact: true,
  })
  await card.dragTo(won, { targetPosition: { x: 20, y: 20 } })
  await expect(
    won.getByRole("group", {
      name: "Studio North · Workspace rollout",
      exact: true,
    }),
  ).toBeVisible()
  await page.getByRole("button", { name: "Undo", exact: true }).click()
  await expect(
    page
      .getByRole("region", { name: "Negotiation opportunities", exact: true })
      .getByRole("group", {
        name: "Studio North · Workspace rollout",
        exact: true,
      }),
  ).toBeVisible()
})

test("pipeline and editor share Naum surfaces in both themes without overflow", async ({
  page,
}, testInfo) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  await page.goto("/showcase/crm/pipeline")
  for (const theme of ["light", "dark"]) {
    if (theme === "dark")
      await page
        .getByRole("button", { name: "Toggle light or dark theme" })
        .click()
    await expect(
      page.getByRole("heading", { name: "Pipeline", exact: true }),
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
    await expect(page).toHaveScreenshot(`pipeline-${theme}.png`, {
      fullPage: true,
      animations: "disabled",
    })
    await captureVisualEvidence(page, testInfo, `pipeline-${theme}.png`, true)
    await page
      .getByRole("button", { name: "New opportunity", exact: true })
      .click()
    const dialog = page.getByRole("dialog", { name: "New opportunity" })
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([])
    await expect(dialog).toHaveScreenshot(`deal-editor-${theme}.png`, {
      animations: "disabled",
    })
    await captureVisualEvidence(dialog, testInfo, `deal-editor-${theme}.png`)
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click()
  }
  await page
    .getByRole("textbox", { name: "Search opportunities" })
    .fill("No matches")
  await expect(
    page.getByText("No matching opportunities", { exact: true }),
  ).toHaveCount(4)
  await page.setViewportSize({ width: 320, height: 640 })
  await page
    .getByRole("button", { name: "New opportunity", exact: true })
    .click()
  await expect(
    page.getByRole("dialog").getByRole("button", { name: "Save opportunity" }),
  ).toBeInViewport()
  expect(errors).toEqual([])
})
