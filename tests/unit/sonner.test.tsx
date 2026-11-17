import { render } from "@testing-library/react"
import { expect, it, vi } from "vitest"
import { Toaster } from "@/components/ui/sonner"

const capture = vi.hoisted(() => vi.fn())
vi.mock("sonner", () => ({
  Toaster: (props: unknown) => {
    capture(props)
    return null
  },
}))

it("preserves toast defaults when consumers customize individual options", () => {
  render(
    <Toaster
      className="custom-toaster"
      theme="dark"
      style={{ marginTop: 8 }}
      icons={{ success: <span>Done</span> }}
      toastOptions={{
        duration: 8000,
        classNames: { toast: "custom-toast", actionButton: "custom-action" },
      }}
    />,
  )
  expect(capture).toHaveBeenCalledWith(
    expect.objectContaining({
      theme: "dark",
      className: expect.stringContaining("custom-toaster"),
      style: expect.objectContaining({
        "--normal-bg": "var(--popover)",
        marginTop: 8,
      }),
      icons: expect.objectContaining({
        success: expect.anything(),
        error: expect.anything(),
      }),
      toastOptions: expect.objectContaining({
        duration: 8000,
        classNames: expect.objectContaining({
          toast: expect.stringMatching(/cn-toast.*custom-toast/),
          description: expect.stringContaining("text-muted-foreground"),
          actionButton: "custom-action",
        }),
      }),
    }),
  )
})
