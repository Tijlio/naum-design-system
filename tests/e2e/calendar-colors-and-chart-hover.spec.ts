import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import { settleAnimations } from "./ui-stability"
import { captureVisualEvidence } from "./visual-evidence"

for (const theme of ["light", "dark"]) {
  test(`calendar filters use the appointment palette in ${theme} mode`, async ({
    page,
  }, testInfo) => {
    await page.goto("/showcase/calendar")
    if (theme === "dark")
      await page
        .getByRole("button", { name: "Toggle light or dark theme" })
        .click()
    await settleAnimations(page)
    const colors: string[] = []
    for (const name of ["Sales", "Team", "Personal"]) {
      const checkbox = page.getByRole("checkbox", { name, exact: true })
      await expect(checkbox).toBeChecked()
      const color = await checkbox.evaluate(
        (node) => getComputedStyle(node).backgroundColor,
      )
      const event = page
        .locator(`.calendar-event[data-calendar="${name}"]`)
        .first()
      const palette = await event.evaluate((node) => {
        const styles = getComputedStyle(node)
        return {
          background: styles.backgroundColor,
          foreground: styles.color,
        }
      })
      expect(color).toBe(palette.background)
      await expect(checkbox).toHaveCSS("color", palette.foreground)
      await expect(checkbox).toHaveCSS("border-top-color", "rgba(0, 0, 0, 0)")
      colors.push(color)
      await checkbox.uncheck()
      await expect(checkbox).not.toBeChecked()
      await checkbox.check()
    }
    expect(new Set(colors).size).toBe(3)
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([])
    await captureVisualEvidence(
      page.getByRole("group", { name: "My calendars", exact: true }),
      testInfo,
      `calendar-filters-${theme}.png`,
    )
  })

  test(`bar hover keeps its tooltip without a cursor outline in ${theme} mode`, async ({
    page,
  }, testInfo) => {
    for (const [path, chartSelector] of [
      [
        "/showcase/crm",
        '[aria-label="Pipeline value by opportunity, in euros"]',
      ],
      ["/", '[data-slot="chart"]:has(.recharts-bar)'],
    ]) {
      await page.goto(path)
      // The second route retains the theme from the first one.
      if (path === "/showcase/crm" && theme === "dark")
        await page
          .getByRole("button", { name: "Toggle light or dark theme" })
          .click()
      const chart = page.locator(chartSelector).first()
      await chart.locator(".recharts-bar-rectangle").first().hover()
      await expect(chart.locator(".recharts-tooltip-cursor")).toHaveCSS(
        "stroke",
        "none",
      )
      await expect(chart.locator(".recharts-tooltip-wrapper")).toBeVisible()
      await captureVisualEvidence(
        chart,
        testInfo,
        `${path === "/" ? "bento" : "crm"}-bar-hover-${theme}.png`,
      )
    }
  })
}
