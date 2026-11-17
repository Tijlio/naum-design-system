import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import { chooseOption } from "./showcase-controls"
import { captureVisualEvidence } from "./visual-evidence"

const SCENES = [
  "contact-detail",
  "contact-form",
  "event-editor",
  "calendar-month",
  "calendar-day",
  "date-time-picker",
  "workspace-search",
  "navigation",
  "contacts-empty",
  "relationship-menu",
] as const

for (const scene of SCENES) {
  for (const theme of ["light", "dark"] as const) {
    test(`${scene} shares Bento surfaces in ${theme} mode`, async ({
      page,
    }, testInfo) => {
      await page.clock.setFixedTime(new Date("2026-11-17T10:00:00"))
      await page.goto(
        scene.startsWith("contact") || scene === "relationship-menu"
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
      if (scene === "event-editor" || scene === "date-time-picker")
        await page
          .getByRole("button", { name: "New appointment", exact: true })
          .click()
      if (scene === "calendar-month")
        await chooseOption(page, "Calendar view", "Month")
      if (scene === "calendar-day")
        await chooseOption(page, "Calendar view", "Day")
      if (scene === "date-time-picker")
        await page.getByRole("button", { name: "Start", exact: true }).click()
      if (scene === "workspace-search")
        await page.getByRole("button", { name: "Search", exact: true }).click()
      if (scene === "navigation")
        await page.getByRole("button", { name: "Toggle Sidebar" }).click()
      if (scene === "contacts-empty")
        await page
          .getByRole("searchbox", { name: "Search contacts" })
          .fill("No matching contact")
      if (scene === "relationship-menu")
        await page
          .getByRole("combobox", { name: "Filter by relationship" })
          .click()
      const surface =
        scene === "relationship-menu"
          ? page.locator('[data-slot="select-content"]')
          : scene === "calendar-month"
            ? page.getByRole("region", { name: "Month calendar" })
            : scene === "calendar-day"
              ? page.getByRole("region", { name: "Calendar time grid" })
              : scene === "date-time-picker"
                ? page.locator('[data-slot="popover-content"]')
                : scene === "workspace-search" || scene === "contacts-empty"
                  ? page.getByRole("main")
                  : scene === "navigation"
                    ? page.locator('[data-slot="sidebar"]:visible')
                    : page.getByRole("dialog")
      await expect(surface).toBeVisible()
      if (scene === "workspace-search") {
        await expect(
          page.getByRole("combobox", { name: "Search workspace" }),
        ).toBeInViewport()
        await expect(
          page.getByRole("option", { name: "Calendar", exact: true }),
        ).toBeInViewport()
      }
      if (scene === "relationship-menu") {
        const alpha = await surface.evaluate((element) => {
          const canvas = document.createElement("canvas")
          canvas.width = canvas.height = 1
          const context = canvas.getContext("2d")
          if (!context) throw new Error("Canvas context is unavailable")
          context.fillStyle = getComputedStyle(element).backgroundColor
          context.fillRect(0, 0, 1, 1)
          return context.getImageData(0, 0, 1, 1).data[3]
        })
        expect(alpha).toBe(255)
      }
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
      await captureVisualEvidence(surface, testInfo, `${scene}-${theme}.png`)
    })
  }
}
