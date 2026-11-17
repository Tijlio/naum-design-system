import { createRef, useState } from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { expect, it, vi } from "vitest"
import { AppPage } from "@/components/blocks/app-page"
import { PageHeader } from "@/components/blocks/page-header"
import { PageToolbar } from "@/components/blocks/page-toolbar"
import { SearchInput } from "@/components/ui/search-input"
import { Button } from "@/components/ui/button"
import { MotionProvider } from "@/components/ui/motion"

it("composes one page heading, a zero count and independent toolbar actions", () => {
  const create = vi.fn()
  const apply = vi.fn()
  render(
    <MotionProvider reducedMotion="always">
      <AppPage>
        <PageHeader
          title="Contacts"
          eyebrow="Relationships"
          count={0}
          actions={<Button onClick={create}>New contact</Button>}
        />
        <PageToolbar
          aria-label="Contact filters"
          actions={<Button onClick={apply}>Apply filters</Button>}
        >
          <SearchInput label="Search contacts" />
        </PageToolbar>
      </AppPage>
    </MotionProvider>,
  )
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
    "Contacts0",
  )
  expect(
    screen
      .getByRole("group", { name: "Contact filters" })
      .contains(screen.getByRole("searchbox", { name: "Search contacts" })),
  ).toBe(true)
  fireEvent.click(screen.getByRole("button", { name: "New contact" }))
  fireEvent.click(screen.getByRole("button", { name: "Apply filters" }))
  expect(create).toHaveBeenCalledOnce()
  expect(apply).toHaveBeenCalledOnce()
})

it("forwards search refs, controlled values and native form transport", () => {
  const input = createRef<HTMLInputElement>()
  const Example = () => {
    const [query, setQuery] = useState("")
    return (
      <form aria-label="Find contacts">
        <SearchInput
          ref={input}
          label="Search contacts"
          name="query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </form>
    )
  }
  render(<Example />)
  const search = screen.getByRole("searchbox", { name: "Search contacts" })
  fireEvent.change(search, { target: { value: "Emma" } })
  expect(input.current?.value).toBe("Emma")
  const form = screen.getByRole("form", { name: "Find contacts" })
  expect(form).toBeInstanceOf(HTMLFormElement)
  if (form instanceof HTMLFormElement)
    expect(new FormData(form).get("query")).toBe("Emma")
})

it("preserves disabled, read-only and associated invalid search states", () => {
  const { rerender } = render(<SearchInput label="Search contacts" disabled />)
  expect(screen.getByRole("searchbox").hasAttribute("disabled")).toBe(true)
  rerender(
    <>
      <SearchInput
        id="contact-query"
        label="Search contacts"
        readOnly
        value="Emma"
        aria-invalid
        aria-describedby="query-error"
      />
      <p id="query-error">Search is unavailable.</p>
    </>,
  )
  const input = screen.getByRole("searchbox", { name: "Search contacts" })
  expect(input.getAttribute("readonly")).toBe("")
  expect(input.getAttribute("aria-invalid")).toBe("true")
  expect(input.getAttribute("aria-describedby")).toBe("query-error")
  expect(input.id).toBe("contact-query")
})
