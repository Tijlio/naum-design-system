import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { expect, it, vi } from "vitest"
import { CodeSample } from "@/components/docs/code-sample"

it("copies the current example and clears the copied state when code changes", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  })
  const { rerender } = render(<CodeSample code="first" />)
  fireEvent.click(screen.getByRole("button", { name: "Copy code" }))
  await waitFor(() =>
    expect(screen.getByRole("status").textContent).toBe("Copied to clipboard."),
  )
  expect(writeText).toHaveBeenCalledWith("first")
  rerender(<CodeSample code="second" />)
  expect(screen.getByRole("status").textContent).toBe("")
  fireEvent.click(screen.getByRole("button", { name: "Copy code" }))
  await waitFor(() => expect(writeText).toHaveBeenLastCalledWith("second"))
})

it("keeps code selectable and gives recovery when clipboard access fails", async () => {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: vi.fn().mockRejectedValue(new Error("Blocked")) },
  })
  render(<CodeSample code="select this" />)
  fireEvent.click(screen.getByRole("button", { name: "Copy code" }))
  await waitFor(() =>
    expect(screen.getByRole("status").textContent).toContain("Select and copy"),
  )
  expect(screen.getByRole("code").textContent).toBe("select this")
})
