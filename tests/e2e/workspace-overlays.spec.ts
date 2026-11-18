import { expect, test } from "@playwright/test"

test("contact sheet animates and nested editors shield sibling actions", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.goto("/showcase/crm/contacts")
  await page.evaluate(() => {
    document.addEventListener("transitionrun", (event) => {
      if (
        event.target instanceof HTMLElement &&
        event.target.dataset.slot === "sheet-content" &&
        event.propertyName === "translate"
      ) {
        event.target.dataset.testSheetTranslated = "true"
      }
    })
  })
  await page.getByRole("button", { name: /Emma Laurent/ }).click()
  const sheet = page.getByRole("dialog", { name: "Emma Laurent", exact: true })
  await expect(sheet).toHaveAttribute("data-test-sheet-translated", "true")

  for (const name of ["New opportunity", "New task", "New appointment"]) {
    const action = sheet.getByRole("button", { name, exact: true })
    await action.click()
    const editor = page.getByRole("dialog", { name, exact: true })
    await expect(editor).toBeVisible()
    const overlay = page.locator('[data-slot="dialog-overlay"]')
    await expect(overlay).toBeVisible()
    await expect(overlay).toHaveCSS("background-color", "oklab(0 0 0 / 0.4)")
    expect(
      await page.evaluate(() =>
        document.elementFromPoint(2, 2)?.getAttribute("data-slot"),
      ),
    ).toBe("dialog-overlay")

    await page.keyboard.press("Control+k")
    await expect(
      page.getByRole("combobox", { name: "Search workspace" }),
    ).toHaveCount(0)
    await editor.getByRole("button", { name: "Cancel", exact: true }).click()
    await expect(editor).toBeHidden()
    await expect(action).toBeFocused()
  }
})
