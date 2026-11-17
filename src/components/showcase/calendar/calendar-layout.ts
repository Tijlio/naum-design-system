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

export const getEventDayBounds = (event: Appointment, day: Date) => {
  const start = Math.min(
    1440,
    Math.max(0, differenceInMinutes(parseISO(event.start), startOfDay(day))),
  )
  const end = Math.min(
    1440,
    differenceInMinutes(parseISO(event.end), startOfDay(day)),
  )
  return {
    start,
    end,
    top: (start / 60) * HOUR_HEIGHT,
    height: Math.min(
      Math.max(28, ((end - start) / 60) * HOUR_HEIGHT),
      ((1440 - start) / 60) * HOUR_HEIGHT,
    ),
  }
}

// Reserve lanes for the drawn bounds, including minimum card height, so short
// cards cannot collide. Cross-midnight events are clipped to each visible day.
export const layoutDayEvents = (
  events: Appointment[],
  day: Date,
): PlacedEvent[] => {
  const timed = events
    .filter((event) => !event.allDay && occursOnDay(event, day))
    .map((event) => {
      const bounds = getEventDayBounds(event, day)
      return {
        event,
        ...bounds,
        layoutEnd: bounds.start + (bounds.height / HOUR_HEIGHT) * 60,
      }
    })
    .sort((a, b) => a.start - b.start || b.end - a.end)
  const result: PlacedEvent[] = []
  let group: typeof timed = []
  let groupEnd = -1
  const flush = () => {
    const lanes: number[] = []
    const placed = group.map((entry) => {
      const freeLane = lanes.findIndex((end) => end <= entry.start)
      const column = freeLane < 0 ? lanes.length : freeLane
      lanes[column] = entry.layoutEnd
      return {
        event: entry.event,
        column,
        top: entry.top,
        height: entry.height,
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
    groupEnd = Math.max(groupEnd, entry.layoutEnd)
  }
  if (group.length) flush()
  return result
}
