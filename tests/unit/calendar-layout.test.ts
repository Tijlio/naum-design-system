import { describe, expect, it } from "vitest"
import { parseISO } from "date-fns"
import {
  layoutDayEvents,
  occursOnDay,
  resizeAppointment,
} from "@/components/showcase/calendar/calendar-layout"
import type { Appointment } from "@/components/showcase/showcase-data"

const event = (
  id: string,
  start: string,
  end: string,
  allDay = false,
): Appointment => ({
  id,
  title: id,
  start,
  end,
  allDay,
  calendar: "Team",
  description: "",
})
const day = parseISO("2026-11-17")

describe("calendar event layout", () => {
  it("allocates separate lanes for overlapping events and reuses lanes at boundaries", () => {
    const placed = layoutDayEvents(
      [
        event("a", "2026-11-17T09:00", "2026-11-17T10:00"),
        event("b", "2026-11-17T09:30", "2026-11-17T11:00"),
        event("c", "2026-11-17T10:00", "2026-11-17T11:00"),
        event("d", "2026-11-17T11:00", "2026-11-17T12:00"),
      ],
      day,
    )
    expect(placed.map(({ column, columns }) => [column, columns])).toEqual([
      [0, 2],
      [1, 2],
      [0, 2],
      [0, 1],
    ])
    expect(placed[0].top).toBe(9 * 64)
  })
  it("clips overnight events and treats all-day end dates as exclusive", () => {
    const overnight = event("night", "2026-11-16T23:00", "2026-11-17T02:00")
    expect(layoutDayEvents([overnight], day)[0]).toMatchObject({
      top: 0,
      height: 128,
    })
    const offsite = event(
      "offsite",
      "2026-11-17T00:00",
      "2026-11-18T00:00",
      true,
    )
    expect(occursOnDay(offsite, day)).toBe(true)
    expect(occursOnDay(offsite, parseISO("2026-11-18"))).toBe(false)
    expect(layoutDayEvents([offsite], day)).toEqual([])
  })
})

it("snaps resizing to quarters and keeps at least fifteen minutes", () => {
  const source = event("meeting", "2026-11-17T09:30", "2026-11-17T10:30")
  expect(resizeAppointment(source, "end", 30).end).toBe("2026-11-17T11:00")
  expect(resizeAppointment(source, "end", -120).end).toBe("2026-11-17T09:45")
  expect(resizeAppointment(source, "start", 120).start).toBe("2026-11-17T10:15")
})
