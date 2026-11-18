import { expect, test } from "@playwright/test"
import { chooseOption } from "./showcase-controls"
import { settleAnimations } from "./ui-stability"

// Exercise real motion as well as the suite's default reduced-motion coverage.
test.use({ reducedMotion: "no-preference" })

test("the Bento pill travels between route levels without clipping", async ({
  page,
}, testInfo) => {
  await page.goto("/docs")
  await page.getByLabel("Find a component").fill("app-navigation")
  await page
    .getByRole("navigation", { name: "Component catalog" })
    .getByRole("button", { name: "app-navigation Block", exact: true })
    .click()
  await chooseOption(page, "Navigation style", "Sections")
  const preview = page.getByLabel("Block preview")
  await settleAnimations(page)
  const overview = await preview
    .getByRole("button", { name: "Overview", exact: true })
    .evaluate((node) => {
      const box = node.getBoundingClientRect()
      return box.y + box.height / 2 + window.scrollY
    })
  const calendar = await preview
    .getByRole("button", { name: "Calendar", exact: true })
    .evaluate((node) => {
      const box = node.getBoundingClientRect()
      return box.y + box.height / 2 + window.scrollY
    })
  await preview.getByRole("button", { name: "Calendar", exact: true }).click()
  const samples = await preview
    .locator('[data-slot="navigation-active"]')
    .evaluate(async (node) => {
      const points: number[] = []
      for (let frame = 0; frame < 45; frame++) {
        const box = node.getBoundingClientRect()
        points.push(box.y + box.height / 2 + window.scrollY)
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => resolve()),
        )
      }
      return {
        points,
        overflow: node.parentElement
          ? getComputedStyle(node.parentElement).overflow
          : null,
      }
    })
  expect(samples.overflow).toBe("visible")
  expect(
    samples.points.some(
      (y) =>
        y > Math.min(overview, calendar) + 3 &&
        y < Math.max(overview, calendar) - 3,
    ),
  ).toBe(true)
  expect(
    Math.abs((samples.points.at(-1) ?? Number.NaN) - calendar),
  ).toBeLessThan(1)
  await preview.getByRole("button", { name: "Contacts", exact: true }).click()
  await expect(
    preview.getByRole("button", { name: "Contacts", exact: true }),
  ).toHaveAttribute("aria-current", "page")
  await chooseOption(page, "Navigation style", "Collapsible")
  await preview.getByRole("button", { name: "CRM", exact: true }).click()
  await expect(
    preview.getByRole("button", { name: "Contacts", exact: true }),
  ).toBeHidden()
  // A collapsed active group retains a visible indicator.
  await expect(preview.locator('[data-slot="navigation-active"]')).toBeVisible()
  await expect(page.getByLabel("Block usage")).toContainText(
    'variant="collapsible"',
  )
  await page.screenshot({
    path: testInfo.outputPath("navigation-variants.png"),
    fullPage: true,
  })
})

test("collapsed navigation rows fill the flyout", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name === "mobile",
    "The icon rail is desktop-only.",
  )

  await page.goto("/showcase/crm")
  await page.getByRole("button", { name: "Toggle Sidebar" }).click()
  await page.getByRole("button", { name: "CRM", exact: true }).press("Enter")
  const menu = page.getByRole("menu", { name: "CRM navigation" })
  await settleAnimations(page)
  const active = menu.getByRole("menuitem", { name: "Overview", exact: true })
  const contacts = menu.getByRole("menuitem", { name: "Contacts", exact: true })
  await expect(active).toHaveAttribute("aria-current", "page")
  await page.keyboard.press("ArrowDown")
  await expect(contacts).toBeFocused()

  const sizes = await menu.evaluate((popup) => {
    const style = getComputedStyle(popup)
    const available =
      popup.clientWidth -
      parseFloat(style.paddingLeft) -
      parseFloat(style.paddingRight)
    const rows = Array.from(popup.querySelectorAll('[role="menuitem"]'))
    const pill = popup.querySelector('[data-slot="navigation-flyout-active"]')
    return {
      available,
      rowWidths: rows.map((row) => row.getBoundingClientRect().width),
      pillWidth: pill?.getBoundingClientRect().width ?? 0,
    }
  })
  expect(sizes.rowWidths.length).toBeGreaterThan(1)
  for (const rowWidth of sizes.rowWidths)
    expect(Math.abs(rowWidth - sizes.available)).toBeLessThan(1)
  expect(Math.abs(sizes.pillWidth - sizes.available)).toBeLessThanOrEqual(2)
})
