import { fireEvent, render, screen } from "@testing-library/react"
import { expect, it, vi } from "vitest"
import { SiteSearch } from "@/components/search/site-search"
import { MotionProvider } from "@/components/ui/motion"

const push = vi.hoisted(() => vi.fn())
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }))

it("expands, focuses, searches and restores trigger focus on Escape", () => {
  render(
    <MotionProvider reducedMotion="always">
      <SiteSearch />
    </MotionProvider>,
  )
  const trigger = screen.getByRole("button", { name: /^Search$/ })
  fireEvent.click(trigger)
  expect(screen.getByRole("combobox", { name: "Search workspace" })).toBe(
    document.activeElement,
  )
  fireEvent.keyDown(screen.getByRole("combobox"), { key: "Escape" })
  expect(document.activeElement).toBe(trigger)
  expect(trigger.getAttribute("aria-expanded")).toBe("false")
})

it("opens from the keyboard and routes a selected result", () => {
  render(
    <MotionProvider reducedMotion="always">
      <SiteSearch />
    </MotionProvider>,
  )
  fireEvent.keyDown(document, { key: "k", ctrlKey: true })
  fireEvent.click(screen.getByRole("option", { name: /Component preview/ }))
  expect(push).toHaveBeenCalledWith("/preview")
})
