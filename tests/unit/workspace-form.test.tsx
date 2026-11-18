import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { expect, it, vi } from "vitest"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useWorkspaceForm } from "@/components/showcase/forms/use-workspace-form"
import { WorkspaceFieldError } from "@/components/showcase/forms/workspace-field-error"
import { DiscardChangesDialog } from "@/components/showcase/forms/discard-changes-dialog"
import { WorkspaceValidationError } from "@/components/showcase/workspace-validation"
const Editor = ({
  save,
  close,
}: {
  save: (data: FormData) => void | Promise<void>
  close: () => void
}) => {
  const form = useWorkspaceForm(close)
  return (
    <>
      <form
        {...form.formProps}
        aria-label="Editor"
        onSubmit={form.submit(save)}
      >
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required {...form.field("title")} />
        <WorkspaceFieldError {...form.error("title")} />
        <WorkspaceFieldError {...form.error("_form")} />
        <Button type="submit" disabled={form.saving}>
          Save
        </Button>
        <Button type="button" onClick={form.requestClose}>
          Cancel
        </Button>
      </form>
      <DiscardChangesDialog {...form.discardProps} />
    </>
  )
}
it("associates validation messages, focuses the first invalid control, and clears a corrected field", async () => {
  const save = vi.fn()
  render(<Editor save={save} close={vi.fn()} />)
  fireEvent.submit(screen.getByRole("form"))
  const input = screen.getByRole("textbox", { name: "Title" })
  await waitFor(() => expect(document.activeElement).toBe(input))
  expect(input.getAttribute("aria-invalid")).toBe("true")
  expect(
    document.getElementById(input.getAttribute("aria-describedby") ?? "")
      ?.textContent,
  ).toBe("Complete this field.")
  expect(save).not.toHaveBeenCalled()
  fireEvent.change(input, { target: { value: "Call customer" } })
  expect(input.getAttribute("aria-invalid")).toBe("false")
})
it("retains drafts on failure and allows recovery without duplicating submissions", async () => {
  const pending = Promise.withResolvers<void>()
  const close = vi.fn()
  const save = vi
    .fn()
    .mockRejectedValueOnce(
      new WorkspaceValidationError({ title: "Choose another title." }),
    )
    .mockImplementationOnce(() => pending.promise)
  render(<Editor save={save} close={close} />)
  const input = screen.getByRole("textbox", { name: "Title" })
  fireEvent.change(input, { target: { value: "Call customer" } })
  fireEvent.submit(screen.getByRole("form"))
  await screen.findByText("Choose another title.")
  expect((input as HTMLInputElement).value).toBe("Call customer")
  expect(close).not.toHaveBeenCalled()
  fireEvent.change(input, { target: { value: "Call customer tomorrow" } })
  fireEvent.submit(screen.getByRole("form"))
  fireEvent.submit(screen.getByRole("form"))
  expect(save).toHaveBeenCalledTimes(2)
  await act(async () => pending.resolve())
  expect(close).toHaveBeenCalledOnce()
})
it("protects changed drafts on cancel and restores editing when discard is declined", async () => {
  const close = vi.fn()
  render(<Editor save={vi.fn()} close={close} />)
  const input = screen.getByRole("textbox", { name: "Title" })
  fireEvent.change(input, { target: { value: "Unsaved draft" } })
  fireEvent.click(screen.getByRole("button", { name: "Cancel", exact: true }))
  await screen.findByRole("alertdialog", { name: "Discard changes?" })
  fireEvent.click(screen.getByRole("button", { name: "Keep editing" }))
  expect(close).not.toHaveBeenCalled()
  expect((input as HTMLInputElement).value).toBe("Unsaved draft")
  fireEvent.click(screen.getByRole("button", { name: "Cancel", exact: true }))
  fireEvent.click(
    await screen.findByRole("button", { name: "Discard changes", exact: true }),
  )
  expect(close).toHaveBeenCalledOnce()
})
