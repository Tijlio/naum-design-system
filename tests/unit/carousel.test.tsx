import { render, waitFor } from "@testing-library/react"
import { expect, it, vi } from "vitest"
import { Carousel } from "@/components/ui/carousel"

const api = vi.hoisted(() => ({
  canScrollPrev: vi.fn(() => false),
  canScrollNext: vi.fn(() => true),
  scrollPrev: vi.fn(),
  scrollNext: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
}))
vi.mock("embla-carousel-react", () => ({ default: () => [() => {}, api] }))

it("removes every event subscription on unmount", async () => {
  const { unmount } = render(<Carousel aria-label="Examples">Slides</Carousel>)
  await waitFor(() => expect(api.on).toHaveBeenCalledTimes(2))
  unmount()
  for (const [event, listener] of api.on.mock.calls) {
    expect(api.off).toHaveBeenCalledWith(event, listener)
  }
})
