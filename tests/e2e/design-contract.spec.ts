import { expect, test } from "@playwright/test"
import { settleAnimations } from "./ui-stability"

for (const theme of ["light", "dark"]) {
  test(`menus and chart tooltips stay opaque in ${theme} mode`, async ({
    page,
  }, testInfo) => {
    let surfaceIndex = 0
    const assertOpaque = async (selector: string) => {
      const surface = page.locator(selector).first()
      await expect(surface).toBeVisible()
      await settleAnimations(page)
      expect(
        await surface.evaluate((node) => {
          const canvas = document.createElement("canvas")
          canvas.width = canvas.height = 1
          const context = canvas.getContext("2d")
          if (!context) throw new Error("Canvas unavailable")
          context.fillStyle = getComputedStyle(node).backgroundColor
          context.fillRect(0, 0, 1, 1)
          return context.getImageData(0, 0, 1, 1).data[3]
        }),
      ).toBe(255)
      await surface.screenshot({
        path: testInfo.outputPath(
          `opaque-surface-${++surfaceIndex}-${theme}.png`,
        ),
      })
    }
    await page.goto("/")
    if (theme === "dark")
      await page
        .getByRole("button", { name: "Toggle light or dark theme" })
        .click()
    await page.getByRole("button", { name: "Finance", exact: true }).click()
    await expect(
      page.getByText("General Ledger", { exact: true }),
    ).toBeVisible()
    await assertOpaque(
      '.naum-popup-surface:has([data-slot="navigation-menu-content"])',
    )
    await page.goto("/showcase/crm/contacts")
    await page
      .getByRole("combobox", { name: "Saved view", exact: true })
      .click()
    await assertOpaque('[data-slot="select-content"]')
    await page.goto("/showcase/crm")
    const chart = page.locator(
      '[aria-label="Pipeline value by opportunity, in euros"]',
    )
    await chart.locator(".recharts-bar-rectangle").first().hover()
    await assertOpaque(".recharts-tooltip-wrapper .naum-popup-surface")
  })

  test(`shared spacing and surface tokens reach the application in ${theme} mode`, async ({
    page,
  }) => {
    await page.goto("/showcase/crm/contacts")
    if (theme === "dark")
      await page
        .getByRole("button", { name: "Toggle light or dark theme" })
        .click()
    await page.evaluate(() => {
      const root = document.documentElement.style
      root.setProperty("--naum-space-page", "32px")
      root.setProperty("--naum-space-control", "20px")
      root.setProperty("--naum-inset-panel", "28px")
      root.setProperty("--card", "rgb(220, 225, 230)")
    })
    await expect(page.locator('[data-slot="app-page"]')).toHaveCSS(
      "row-gap",
      "32px",
    )
    const toolbar = page.getByRole("group", {
      name: "Contacts controls",
      exact: true,
    })
    await expect(toolbar).toHaveCSS("column-gap", "20px")
    await expect(toolbar).toHaveCSS("padding-left", "28px")
    await expect(page.locator('[data-slot="card"]').first()).toHaveCSS(
      "background-color",
      "rgb(220, 225, 230)",
    )
    await page.getByRole("button", { name: "New contact", exact: true }).click()
    const form = page.getByRole("dialog").locator("form")
    await expect(form).toHaveCSS("row-gap", "16px")
    await expect(form.locator(".naum-field").first()).toHaveCSS(
      "row-gap",
      "8px",
    )
  })

  test(`calendar filters share appointment tones and align in ${theme} mode`, async ({
    page,
  }) => {
    await page.goto("/showcase/calendar")
    if (theme === "dark")
      await page
        .getByRole("button", { name: "Toggle light or dark theme" })
        .click()
    await settleAnimations(page)
    const checkboxes = page
      .getByRole("group", { name: "My calendars", exact: true })
      .getByRole("checkbox")
    const tops = await checkboxes.evaluateAll((nodes) =>
      nodes.map((node) => node.getBoundingClientRect().top),
    )
    // At the test widths these controls fit on one line; no item gets a different baseline.
    expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(1)
    for (const [calendar, tone] of [
      ["Sales", "lavender"],
      ["Team", "mint"],
      ["Personal", "amber"],
    ]) {
      const checkbox = page.getByRole("checkbox", {
        name: calendar,
        exact: true,
      })
      await expect(checkbox).toHaveAttribute("data-tone", tone)
      const event = page
        .locator(`.calendar-event[data-calendar="${calendar}"]`)
        .first()
      await expect(event).toHaveAttribute("data-tone", tone)
      const color = await event.evaluate((node) => getComputedStyle(node).color)
      await expect(checkbox).toHaveCSS("color", color)
    }
  })
}
