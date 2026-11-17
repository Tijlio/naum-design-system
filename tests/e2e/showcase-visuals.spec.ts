import { expect, test } from "@playwright/test"
import { captureVisualEvidence } from "./visual-evidence"

const SCENES = [
  { name: "bento", path: "/" },
  { name: "crm", path: "/showcase/crm" },
  { name: "contacts", path: "/showcase/crm/contacts" },
  { name: "calendar", path: "/showcase/calendar" },
] as const

for (const scene of SCENES) {
  test(`${scene.name} presentation in light and dark mode`, async ({
    page,
  }, testInfo) => {
    await page.clock.setFixedTime(new Date("2026-11-17T10:00:00"))
    await page.goto(scene.path)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    if (scene.name === "calendar")
      await expect(page.getByLabel("Calendar view")).toContainText(
        testInfo.project.name === "mobile" ? "Agenda" : "Week",
      )
    await page.evaluate(() => document.fonts.ready)
    await expect(page).toHaveScreenshot(`${scene.name}-light.png`, {
      fullPage: true,
      animations: "disabled",
    })
    await captureVisualEvidence(page, testInfo, `${scene.name}-light.png`, true)
    await page
      .getByRole("button", { name: "Toggle light or dark theme" })
      .click()
    await expect(page.locator("html")).toHaveClass(/dark/)
    await expect(page).toHaveScreenshot(`${scene.name}-dark.png`, {
      fullPage: true,
      animations: "disabled",
    })
    await captureVisualEvidence(page, testInfo, `${scene.name}-dark.png`, true)
  })
}

test("decorative activity motifs stay centered within their cards", async ({
  page,
}) => {
  await page.goto("/")
  const motifs = page.locator('[data-slot="activity-motif"]')
  await expect(motifs).toHaveCount(6)
  const offsets = await motifs.evaluateAll((elements) =>
    elements.map((element) => {
      const card = element.closest('[data-slot="card"]')
      if (!card) throw new Error("A motif must belong to a card")
      const outer = card.getBoundingClientRect()
      const inner = element.getBoundingClientRect()
      return Math.abs(inner.x + inner.width / 2 - outer.x - outer.width / 2)
    }),
  )
  for (const offset of offsets) expect(offset).toBeLessThan(1)
})
