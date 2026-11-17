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

it("clears the query and restores focus when the shortcut closes search", () => {
  render(
    <MotionProvider reducedMotion="always">
      <SiteSearch />
    </MotionProvider>,
  )
  const trigger = screen.getByRole("button", { name: /^Search$/ })
  fireEvent.keyDown(document, { key: "k", ctrlKey: true })
  fireEvent.change(screen.getByRole("combobox"), {
    target: { value: "Calendar" },
  })
  fireEvent.keyDown(document, { key: "k", ctrlKey: true })
  expect(document.activeElement).toBe(trigger)
  fireEvent.keyDown(document, { key: "k", ctrlKey: true })
  expect(screen.getByRole("combobox")).toHaveProperty("value", "")
})

it("keeps results with identical titles independently selectable", () => {
  render(
    <MotionProvider reducedMotion="always">
      <SiteSearch
        entries={[
          {
            id: "first",
            title: "Review",
            group: "Appointments",
            href: "/first",
          },
          {
            id: "second",
            title: "Review",
            group: "Appointments",
            href: "/second",
          },
        ]}
      />
    </MotionProvider>,
  )
  fireEvent.click(screen.getByRole("button", { name: /^Search$/ }))
  const results = screen.getAllByRole("option", { name: "Review" })
  expect(
    results.filter((result) => result.getAttribute("aria-selected") === "true"),
  ).toHaveLength(1)
  fireEvent.click(results[1])
  expect(push).toHaveBeenCalledWith("/second")
})
