import { createRef } from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { expect, it, vi } from "vitest"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"

it("forwards shared tones without leaking variant props onto DOM elements", () => {
  render(
    <>
      <Badge variant="soft" tone="mint">
        Discovery
      </Badge>
      <Card tone="amber" size="sm" aria-label="Proposal">
        Opportunity
      </Card>
      <Avatar>
        <AvatarFallback variant="soft" tone="lavender">
          EL
        </AvatarFallback>
      </Avatar>
    </>,
  )
  for (const [text, tone] of [
    ["Discovery", "mint"],
    ["Opportunity", "amber"],
    ["EL", "lavender"],
  ]) {
    const element = screen.getByText(text)
    expect(element.getAttribute("data-tone")).toBe(tone)
    expect(element.hasAttribute("tone")).toBe(false)
    expect(element.hasAttribute("variant")).toBe(false)
  }
  expect(screen.getByText("Discovery").getAttribute("data-variant")).toBe(
    "soft",
  )
})

it("preserves checkbox focus, ref, controlled behavior and disabled state with a tone", () => {
  const ref = createRef<HTMLButtonElement>()
  const change = vi.fn()
  const { rerender } = render(
    <Checkbox
      ref={ref}
      tone="mint"
      aria-label="Team"
      checked
      onCheckedChange={change}
    />,
  )
  const checkbox = screen.getByRole("checkbox", { name: "Team" })
  expect(ref.current).toBe(checkbox)
  expect(checkbox.getAttribute("aria-checked")).toBe("true")
  fireEvent.click(checkbox)
  expect(change).toHaveBeenCalledWith(false, expect.anything())
  rerender(
    <Checkbox
      tone="mint"
      aria-label="Team"
      disabled
      checked
      onCheckedChange={change}
    />,
  )
  change.mockClear()
  fireEvent.click(checkbox)
  expect(change).not.toHaveBeenCalled()
})
