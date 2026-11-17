import type { Page } from "@playwright/test"

// Audit settled colors and geometry, rather than an animation's intermediate frame.
// Infinite loading indicators deliberately keep running.
export const settleAnimations = async (page: Page) => {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    )
    await Promise.allSettled(
      document
        .getAnimations()
        .filter(
          (animation) => animation.effect?.getTiming().iterations !== Infinity,
        )
        .map((animation) => animation.finished),
    )
  })
}
