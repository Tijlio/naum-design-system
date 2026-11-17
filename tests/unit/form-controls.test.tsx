import { render, screen } from "@testing-library/react"
import { expect, it } from "vitest"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { SelectControl } from "@/components/ui/select-control"

it("composed select controls participate in native form submission", () => {
  const { container } = render(
    <form>
      <SelectControl
        name="relationship"
        aria-label="Relationship"
        defaultValue="Lead"
        items={[
          { value: "Lead", label: "Lead" },
          { value: "Customer", label: "Customer" },
        ]}
      />
    </form>,
  )
  const form = container.querySelector("form")
  if (!form) throw new Error("Missing form")
  expect(new FormData(form).get("relationship")).toBe("Lead")
  expect(screen.getByRole("combobox", { name: "Relationship" })).toBeDefined()
})

it("date/time pickers use a named Naum trigger and hidden form transport", () => {
  const { container } = render(
    <form>
      <DateTimePicker
        name="start"
        label="Start"
        value="2026-11-17T09:30"
        onValueChange={() => {}}
      />
    </form>,
  )
  expect(screen.getByRole("button", { name: "Start" }).textContent).toContain(
    "17 Nov 2026, 09:30",
  )
  expect(
    container.querySelector('input[type="datetime-local"], input[type="date"]'),
  ).toBeNull()
  const form = container.querySelector("form")
  if (!form) throw new Error("Missing form")
  expect(new FormData(form).get("start")).toBe("2026-11-17T09:30")
})
