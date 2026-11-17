import { render, screen } from "@testing-library/react"
import { expect, it } from "vitest"
import { ActivitiesSection } from "@/components/bento/activities-section"

it("shows volumes with an explicit period instead of an ambiguous delta badge", () => {
  const { container } = render(<ActivitiesSection />)
  expect(screen.queryByText("+2")).toBeNull()
  expect(screen.getAllByText("Last 7 days")).toHaveLength(4)
  expect(screen.getByText("Currently open")).toBeDefined()
  expect(screen.getByText("Due next week")).toBeDefined()
  expect(container.querySelectorAll('[aria-hidden="true"] svg')).toHaveLength(6)
})
