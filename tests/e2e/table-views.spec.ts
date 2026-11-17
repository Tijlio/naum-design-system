import { expect, test } from "@playwright/test"
import { chooseOption } from "./showcase-controls"

test("contact views persist filters, sorting and columns with URL back/forward", async ({
  page,
}, testInfo) => {
  await page.goto("/showcase/crm/contacts")
  await page.getByRole("button", { name: "Next", exact: true }).click()
  await expect(
    page.getByRole("button", { name: /Sofia De Smet/ }),
  ).toBeVisible()
  await page.getByRole("button", { name: "Previous", exact: true }).click()
  await expect(page.getByRole("button", { name: /Sofia De Smet/ })).toHaveCount(
    0,
  )
  await chooseOption(page, "Filter by relationship", "Lead")
  await chooseOption(page, "Filter by owner", "Alex Morgan")
  await page.getByRole("button", { name: "Name", exact: true }).click()
  await chooseOption(page, "Rows per page", "10")
  if (testInfo.project.name === "desktop") {
    await page.getByRole("button", { name: "Columns", exact: true }).click()
    await page
      .getByRole("menuitemcheckbox", { name: "Owner", exact: true })
      .click()
    await page.keyboard.press("Escape")
    await expect(
      page.getByRole("columnheader", { name: "Owner", exact: true }),
    ).toHaveCount(0)
  }
  await page.getByRole("button", { name: "Save view", exact: true }).click()
  const dialog = page.getByRole("dialog", { name: "Save view", exact: true })
  await dialog.getByLabel("View name").fill("Sales leads")
  await dialog.getByRole("button", { name: "Save view", exact: true }).click()
  await expect(dialog).toBeHidden()
  await page.reload()
  await expect(
    page.getByRole("combobox", { name: "Saved view" }),
  ).toContainText("Sales leads")
  await expect(
    page.getByRole("combobox", { name: "Filter by owner" }),
  ).toContainText("Alex Morgan")
  await expect(
    page.getByRole("columnheader", { name: "Name", exact: true }),
  ).toHaveAttribute("aria-sort", "descending")
  await chooseOption(page, "Saved view", "All contacts")
  await chooseOption(page, "Saved view", "Sales leads")
  await page.goBack()
  await expect(
    page.getByRole("combobox", { name: "Saved view" }),
  ).toContainText("All contacts")
  await page.goForward()
  await expect(
    page.getByRole("combobox", { name: "Saved view" }),
  ).toContainText("Sales leads")
  await page.getByRole("textbox", { name: "Search contacts" }).fill("Oliver")
  await expect(
    page.getByRole("combobox", { name: "Saved view" }),
  ).toContainText("Modified")
  await page.getByRole("button", { name: "Update view", exact: true }).click()
  await page.reload()
  await expect(
    page.getByRole("textbox", { name: "Search contacts" }),
  ).toHaveValue("Oliver")
  await page
    .getByRole("button", { name: "Delete view Sales leads", exact: true })
    .click()
  await page.getByRole("button", { name: "Undo", exact: true }).click()
  await expect(
    page.getByRole("combobox", { name: "Saved view" }),
  ).toContainText("Sales leads")
})

test("pipeline table reuses views and bulk updates reach the board", async ({
  page,
}) => {
  await page.goto("/showcase/crm/pipeline?layout=table")
  await chooseOption(page, "Saved view", "My open opportunities")
  await expect(page.getByRole("table", { name: "Opportunities" })).toBeVisible()
  await page
    .getByRole("checkbox", {
      name: "Select Studio North · Workspace rollout",
      exact: true,
    })
    .check()
  await page.getByRole("button", { name: "Mark won 1", exact: true }).click()
  await page.getByRole("tab", { name: "Board", exact: true }).click()
  await page.getByRole("button", { name: "Clear filters", exact: true }).click()
  await expect(
    page
      .getByRole("region", { name: "Won opportunities", exact: true })
      .getByRole("group", {
        name: "Studio North · Workspace rollout",
        exact: true,
      }),
  ).toBeVisible()
})
