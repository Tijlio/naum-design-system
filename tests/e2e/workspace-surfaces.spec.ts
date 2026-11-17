import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import { chooseOption } from "./showcase-controls"

const SCENES = [
  "contact-detail",
  "contact-form",
  "event-editor",
  "calendar-month",
] as const

for (const scene of SCENES) {
  for (const theme of ["light", "dark"] as const) {
    test(`${scene} shares Bento surfaces in ${theme} mode`, async ({
      page,
    }) => {
      await page.clock.setFixedTime(new Date("2026-11-17T10:00:00"))
      await page.goto(
        scene.startsWith("contact")
          ? "/showcase/crm/contacts"
          : "/showcase/calendar",
      )
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
      if (theme === "dark")
        await page
          .getByRole("button", { name: "Toggle light or dark theme" })
          .click()
      if (scene === "contact-detail")
        await page.getByRole("button", { name: /Emma Laurent/ }).click()
      if (scene === "contact-form")
        await page
          .getByRole("button", { name: "New contact", exact: true })
          .click()
      if (scene === "event-editor")
        await page
          .getByRole("button", { name: "New appointment", exact: true })
          .click()
      if (scene === "calendar-month")
        await chooseOption(page, "Calendar view", "Month")
      const surface =
        scene === "calendar-month"
          ? page.getByRole("region", { name: "Month calendar" })
          : page.getByRole("dialog")
      await expect(surface).toBeVisible()
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
      await page.evaluate(() => document.fonts.ready)
      await expect(surface).toHaveScreenshot(`${scene}-${theme}.png`, {
        animations: "disabled",
      })
    })
  }
}
