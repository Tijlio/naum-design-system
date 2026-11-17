import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import { chooseOption } from "./showcase-controls"
import { captureVisualEvidence } from "./visual-evidence"

for (const kind of ["dialog", "sheet"] as const) {
  test(`${kind} examples recover states, validate and restore focus`, async ({
    page,
  }, testInfo) => {
    await page.goto("/docs")
    await page.getByLabel("Find a component").fill(kind)
    await page
      .getByRole("navigation", { name: "Component catalog" })
      .getByRole("button", { name: kind, exact: true })
      .click()
    if (kind === "sheet") {
      await chooseOption(page, "Side", "left")
      await expect(page.getByLabel("Usage")).toContainText('side="left"')
    }
    await page.getByRole("checkbox", { name: "Show close button" }).uncheck()
    const trigger = page.getByRole("button", {
      name: `Open ${kind}`,
      exact: true,
    })
    await trigger.click()
    const overlay = page.getByRole("dialog", {
      name: "Edit workspace",
      exact: true,
    })
    await expect(
      overlay.getByRole("button", { name: "Close", exact: true }),
    ).toHaveCount(0)
    await expect(
      overlay.getByRole("textbox", { name: "Workspace name" }),
    ).toBeFocused()
    await page.keyboard.press("Escape")
    await expect(overlay).toBeHidden()
    await expect(trigger).toBeFocused()
    await page.getByRole("checkbox", { name: "Show close button" }).check()
    await trigger.click()
    for (const [state, recovery] of [
      ["Loading", "Finish loading"],
      ["Error", "Retry"],
      ["Empty", "Create workspace"],
    ]) {
      await chooseOption(page, "Content state", state)
      await expect(
        overlay.getByRole("button", { name: "Save workspace" }),
      ).toBeDisabled()
      if (state === "Loading")
        await expect(overlay.getByRole("status")).toContainText(
          "Loading workspace",
        )
      if (state === "Error")
        await expect(overlay.getByRole("alert")).toContainText(
          "Could not load workspace",
        )
      await overlay.getByRole("button", { name: recovery, exact: true }).click()
      await expect(
        overlay.getByRole("textbox", { name: "Workspace name" }),
      ).toBeFocused()
    }
    await overlay.getByLabel("Workspace name", { exact: true }).fill("")
    await overlay.getByRole("button", { name: "Save workspace" }).click()
    await expect(overlay.getByRole("alert")).toContainText(
      "Enter a workspace name",
    )
    await overlay
      .getByLabel("Workspace name", { exact: true })
      .fill("Naum Design")
    for (const theme of ["light", "dark"]) {
      if (theme === "dark") {
        await overlay
          .getByRole("button", { name: "Cancel", exact: true })
          .click()
        await page
          .getByRole("button", { name: "Toggle light or dark theme" })
          .click()
        await trigger.click()
      }
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze()
        ).violations,
      ).toEqual([])
      expect(
        await overlay.evaluate((node) => node.scrollWidth <= node.clientWidth),
      ).toBe(true)
      await captureVisualEvidence(page, testInfo, `${kind}-${theme}.png`)
    }
    await overlay.getByRole("button", { name: "Save workspace" }).click()
    await expect(overlay).toBeHidden()
    await expect(trigger).toBeFocused()
    await expect(
      page.getByLabel("Live example").getByRole("status"),
    ).toContainText("Saved Naum Design.")
  })
}
