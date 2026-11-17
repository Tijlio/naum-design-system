import {
  addDays,
  addMinutes,
  format,
  differenceInMinutes,
  isAfter,
  isBefore,
  parseISO,
  startOfDay,
  roundToNearestMinutes,
} from "date-fns"
import type { Appointment } from "../showcase-data"

export const HOUR_HEIGHT = 64

export type ResizeEdge = "start" | "end"

export const resizeAppointment = (
  event: Appointment,
  edge: ResizeEdge,
  minutes: number,
): Appointment => {
  const start = parseISO(event.start),
    end = parseISO(event.end)
  const proposed = roundToNearestMinutes(
    addMinutes(edge === "start" ? start : end, minutes),
    { nearestTo: 15 },
  )
  const next =
    edge === "start"
      ? new Date(Math.min(proposed.getTime(), addMinutes(end, -15).getTime()))
      : new Date(Math.max(proposed.getTime(), addMinutes(start, 15).getTime()))
  return { ...event, [edge]: format(next, "yyyy-MM-dd'T'HH:mm") }
}

export const occursOnDay = (event: Appointment, day: Date) =>
  isBefore(parseISO(event.start), addDays(startOfDay(day), 1)) &&
  isAfter(parseISO(event.end), startOfDay(day))

export type PlacedEvent = {
  event: Appointment
  top: number
  height: number
  column: number
  columns: number
}

// Allocate lanes per connected overlap group; an event ending at 11:00 does not
// overlap one starting at 11:00. Cross-midnight events are clipped to each day.
export const layoutDayEvents = (
  events: Appointment[],
  day: Date,
): PlacedEvent[] => {
  const timed = events
    .filter((event) => !event.allDay && occursOnDay(event, day))
    .map((event) => ({
      event,
      start: Math.max(
        0,
        differenceInMinutes(parseISO(event.start), startOfDay(day)),
      ),
      end: Math.min(
        1440,
        differenceInMinutes(parseISO(event.end), startOfDay(day)),
      ),
    }))
    .sort((a, b) => a.start - b.start || b.end - a.end)
  const result: PlacedEvent[] = []
  let group: typeof timed = []
  let groupEnd = -1
  const flush = () => {
    const lanes: number[] = []
    const placed = group.map((entry) => {
      const freeLane = lanes.findIndex((end) => end <= entry.start)
      const column = freeLane < 0 ? lanes.length : freeLane
      lanes[column] = entry.end
      return {
        event: entry.event,
        column,
        top: (entry.start / 60) * HOUR_HEIGHT,
        height: Math.max(28, ((entry.end - entry.start) / 60) * HOUR_HEIGHT),
        columns: 1,
      }
    })
    result.push(...placed.map((entry) => ({ ...entry, columns: lanes.length })))
  }
  for (const entry of timed) {
    if (entry.start >= groupEnd && group.length) {
      flush()
      group = []
      groupEnd = -1
    }
    group.push(entry)
    groupEnd = Math.max(groupEnd, entry.end)
  }
  if (group.length) flush()
  return result
}
