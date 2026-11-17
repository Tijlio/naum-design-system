import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

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

test("contacts can be filtered, created, annotated and archived", async ({
  page,
}) => {
  await page.goto("/showcase/crm/contacts")
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
  await page.getByLabel("Filter by relationship").selectOption("Archived")
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
