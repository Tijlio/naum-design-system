import { expect, test } from "@playwright/test"

test("search dims the page and dismisses without activating page actions", async ({
  page,
}) => {
  await page.goto("/showcase/crm/contacts")
  const trigger = page.getByRole("button", { name: "Search", exact: true })
  await trigger.click()
  await expect(
    page.getByRole("combobox", { name: "Search workspace" }),
  ).toBeFocused()
  const action = page.getByRole("button", { name: "New contact", exact: true })
  const box = await action.boundingBox()
  if (!box) throw new Error("Missing contact action")
  const backdrop = page.locator(".site-search-backdrop")
  await expect(backdrop).toHaveCSS("opacity", "1")
  const point = { x: box.x + box.width - 4, y: box.y + box.height / 2 }
  // A narrow layout can place the search panel directly over the action.
  expect(
    await action.evaluate(
      (element, { x, y }) => !element.contains(document.elementFromPoint(x, y)),
      point,
    ),
  ).toBe(true)
  await page.mouse.click(2, point.y)
  await expect(trigger).toBeFocused()
  await expect(page.getByRole("dialog", { name: "New contact" })).toHaveCount(0)
})
