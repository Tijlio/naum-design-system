import { createRef } from "react"
import { renderToString } from "react-dom/server"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import {
  MotionFadeUp,
  MotionStagger,
  MotionStaggerItem,
  MotionPill,
  MotionProvider,
  MotionDrawPath,
} from "@/components/ui/motion"
import { SidebarMenuSkeleton } from "@/components/ui/sidebar"
import { Slider } from "@/components/ui/slider"
import { FormsCard } from "@/components/preview/forms-card"
import { AdvancedFormsCard } from "@/components/preview/advanced-forms-card"

describe("composable motion primitives", () => {
  it("respects an explicit reduced-motion policy, including SVG drawing", () => {
    const markup = renderToString(
      <MotionProvider reducedMotion="always">
        <MotionFadeUp>Summary</MotionFadeUp>
        <svg>
          <MotionDrawPath d="M0 0L10 10" />
        </svg>
      </MotionProvider>,
    )
    expect(markup).toContain("opacity:1")
    expect(markup).not.toContain("opacity:0.3")
    expect(markup).not.toContain("translateY(12px)")
  })
  it("forwards accessible names, refs, styles and event handlers", () => {
    const onClick = vi.fn()
    const ref = createRef<HTMLDivElement>()
    render(
      <MotionFadeUp
        ref={ref}
        role="region"
        aria-label="Summary"
        id="summary"
        style={{ color: "red" }}
        onClick={onClick}
        initial={false}
      >
        Content
      </MotionFadeUp>,
    )
    const region = screen.getByRole("region", { name: "Summary" })
    expect(ref.current).toBe(region)
    expect(region.id).toBe("summary")
    expect(region.style.color).toBe("red")
    fireEvent.click(region)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("forwards semantics through stagger and pill wrappers", () => {
    render(
      <MotionStagger role="list" aria-label="Metrics" initial={false}>
        <MotionStaggerItem role="listitem">
          <MotionPill layoutId="test" aria-hidden="true" data-testid="pill" />
          Revenue
        </MotionStaggerItem>
      </MotionStagger>,
    )
    expect(screen.getByRole("list", { name: "Metrics" })).toBeDefined()
    expect(screen.getByRole("listitem").textContent).toBe("Revenue")
    expect(screen.getByTestId("pill").getAttribute("aria-hidden")).toBe("true")
  })
})

it("renders deterministic skeleton markup on server and client", () => {
  const server = renderToString(<SidebarMenuSkeleton />)
  const client = render(<SidebarMenuSkeleton />)
  expect(renderToString(<SidebarMenuSkeleton />)).toBe(server)
  expect(
    client.container
      .querySelector<HTMLElement>('[data-sidebar="menu-skeleton-text"]')
      ?.style.getPropertyValue("--skeleton-width"),
  ).toBe("70%")
  expect(renderToString(<SidebarMenuSkeleton width="55%" />)).toContain("55%")
})

describe("accessible consumer examples", () => {
  it("names the region select and framework combobox", () => {
    render(
      <>
        <FormsCard />
        <AdvancedFormsCard />
      </>,
    )
    expect(screen.getByLabelText("Region")).toBeDefined()
    expect(
      screen.getByRole("combobox", { name: "Framework (Combobox)" }),
    ).toBeDefined()
    expect(
      screen.getByLabelText("Workspace").getAttribute("aria-describedby"),
    ).toBe("workspace-description")
  })

  it("renders one labeled thumb for scalar values and distinct labels for ranges", () => {
    const { rerender } = render(
      <Slider thumbAlignment="center" value={42} aria-label="Threshold" />,
    )
    expect(screen.getAllByRole("slider")).toHaveLength(1)
    expect(
      screen.getByRole("slider", { name: "Threshold" }).getAttribute("value"),
    ).toBe("42")
    rerender(
      <Slider
        thumbAlignment="center"
        value={[20, 80]}
        getAriaLabel={(index) => (index === 0 ? "Minimum" : "Maximum")}
      />,
    )
    expect(screen.getAllByRole("slider")).toHaveLength(2)
    expect(screen.getByRole("slider", { name: "Minimum" })).toBeDefined()
    expect(screen.getByRole("slider", { name: "Maximum" })).toBeDefined()
  })
})
