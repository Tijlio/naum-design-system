import { expect, test } from "@playwright/test"
import { DEMO_STORAGE_KEY } from "../../src/components/showcase/workspace-schema"

test("contacts and notes survive reload and reset preserves the theme", async ({
  page,
}) => {
  await page.goto("/showcase/crm/contacts")
  await page.getByRole("button", { name: "New contact", exact: true }).click()
  const dialog = page.getByRole("dialog", { name: "New contact" })
  await dialog.getByLabel("Full name").fill("Ada Rivers")
  await dialog.getByLabel("Email", { exact: true }).fill("ada@example.com")
  await dialog.getByLabel("Company").fill("Ada Studio")
  await dialog.getByRole("button", { name: "Add contact", exact: true }).click()
  await page
    .getByRole("searchbox", { name: "Search contacts" })
    .fill("Ada Rivers")
  await page.getByRole("button", { name: /Ada Rivers/ }).click()
  const details = page.getByRole("dialog")
  await details
    .getByRole("textbox", { name: "Add a note" })
    .fill("Keep this note after reload.")
  await details.getByRole("button", { name: "Save note" }).click()
  await page.reload()
  await expect(page.getByRole("dialog")).toContainText(
    "Keep this note after reload.",
  )
  await page.keyboard.press("Escape")
  await page.getByRole("button", { name: "Toggle light or dark theme" }).click()
  await page.getByRole("button", { name: "Reset demo data" }).click()
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "Cancel", exact: true })
    .click()
  await page.getByRole("button", { name: "Reset demo data" }).click()
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "Reset demo", exact: true })
    .click()
  await expect(page.getByRole("alertdialog")).toBeHidden()
  await expect(page.getByRole("button", { name: /Ada Rivers/ })).toHaveCount(0)
  await page.reload()
  await expect(page.getByRole("heading", { name: /Contacts 8/ })).toBeVisible()
  await expect(page.locator("html")).toHaveClass(/dark/)
})

test("corrupted storage falls back to a usable demo", async ({ page }) => {
  await page.addInitScript(
    (key) => localStorage.setItem(key, "{invalid"),
    DEMO_STORAGE_KEY,
  )
  await page.goto("/showcase/crm")
  await expect(
    page.getByRole("heading", { name: "Good morning, Alex" }),
  ).toBeVisible()
  await expect(
    page.getByRole("status").filter({ hasText: "Session only" }),
  ).toBeVisible()
  await page.getByRole("button", { name: "Reset demo data" }).click()
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "Reset demo", exact: true })
    .click()
  await expect(
    page.getByRole("status").filter({ hasText: "Session only" }),
  ).toHaveCount(0)
})

test("appointments survive reload and remain editable", async ({ page }) => {
  await page.goto("/showcase/calendar")
  await page
    .getByRole("button", { name: "New appointment", exact: true })
    .click()
  await page
    .getByRole("dialog")
    .getByLabel("Title", { exact: true })
    .fill("Persistent review")
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Save appointment" })
    .click()
  await page.reload()
  await page.getByRole("button", { name: "Search", exact: true }).click()
  await page
    .getByRole("combobox", { name: "Search workspace" })
    .fill("Persistent review")
  await page.keyboard.press("Enter")
  await expect(
    page
      .getByRole("dialog", { name: "Edit appointment" })
      .getByLabel("Title", { exact: true }),
  ).toHaveValue("Persistent review")
})

test("open tabs synchronize changes and demo resets", async ({
  page,
  context,
}) => {
  await page.goto("/showcase/crm/contacts")
  const other = await context.newPage()
  await other.goto("/showcase/crm/contacts")
  await expect(other.getByRole("heading", { name: /Contacts 8/ })).toBeVisible()
  await page.getByRole("button", { name: "New contact", exact: true }).click()
  const dialog = page.getByRole("dialog", { name: "New contact" })
  await dialog.getByLabel("Full name").fill("Ada Rivers")
  await dialog.getByLabel("Email", { exact: true }).fill("ada@example.com")
  await dialog.getByLabel("Company").fill("Ada Studio")
  await dialog.getByRole("button", { name: "Add contact", exact: true }).click()
  await expect(other.getByRole("button", { name: /Ada Rivers/ })).toBeVisible()
  await other.getByRole("button", { name: "Reset demo data" }).click()
  await other
    .getByRole("alertdialog")
    .getByRole("button", { name: "Reset demo", exact: true })
    .click()
  await expect(page.getByRole("button", { name: /Ada Rivers/ })).toHaveCount(0)
  await other.close()
})
