import type { NaumTone } from "@/lib/tone"

export type DayTimelineEntry = {
  id: string
  lane: string
  label: string
  start: number
  end: number
  tone?: NaumTone
}

const timeLabel = (minutes: number) => {
  const time = minutes % 1440
  const day = Math.floor(minutes / 1440)
  return `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(time % 60).padStart(2, "0")}${day ? ` (+${day})` : ""}`
}

export const DayTimeline = ({
  entries,
  label,
}: {
  entries: readonly DayTimelineEntry[]
  label: string
}) => {
  const timed = entries
    .filter(
      (entry) =>
        Number.isInteger(entry.start) &&
        Number.isInteger(entry.end) &&
        entry.start >= 0 &&
        entry.end > entry.start,
    )
    .sort((a, b) => a.start - b.start)
  if (!timed.length) return null
  const start = Math.floor(timed[0].start / 60) * 60
  const end = Math.ceil(Math.max(...timed.map((entry) => entry.end)) / 60) * 60
  const span = end - start
  const step = Math.ceil(span / 360) * 60
  const ticks = Array.from(
    { length: Math.ceil(span / step) },
    (_, i) => start + i * step,
  )
  const position = (minute: number) => ((minute - start) / span) * 100

  const lanes = new Map<string, DayTimelineEntry[][]>()
  for (const entry of timed) {
    const rows = lanes.get(entry.lane) ?? []
    const row = rows.find((items) => (items.at(-1)?.end ?? 0) <= entry.start)
    if (row) row.push(entry)
    else rows.push([entry])
    lanes.set(entry.lane, rows)
  }

  return (
    <figure aria-label={label} className="min-w-0 overflow-x-auto" tabIndex={0}>
      <div className="min-w-[30rem] py-2">
        <div
          aria-hidden
          className="relative mb-1 ml-32 h-7 border-b text-xs text-muted-foreground"
        >
          {ticks.map((minute) => (
            <span
              key={minute}
              className="absolute"
              style={{ left: `${position(minute)}%` }}
            >
              {timeLabel(minute)}
            </span>
          ))}
        </div>
        {[...lanes].map(([lane, rows]) => (
          <div
            key={lane}
            className="grid grid-cols-[8rem_1fr] items-center border-b py-1"
          >
            <div className="pr-2 text-xs text-muted-foreground">{lane}</div>
            <div className="space-y-1">
              {rows.map((row) => (
                <div
                  key={row[0].id}
                  className="relative h-7 rounded-md bg-muted/60"
                >
                  {row.map((entry) => {
                    const description = `${entry.label} · ${timeLabel(entry.start)}–${timeLabel(entry.end)}`
                    return (
                      <span
                        key={entry.id}
                        role="img"
                        aria-label={description}
                        title={description}
                        data-tone={entry.tone ?? "lavender"}
                        className="naum-tone naum-tone-fill absolute inset-y-0 truncate rounded-md px-1 text-xs leading-7"
                        style={{
                          left: `${position(entry.start)}%`,
                          width: `${position(entry.end) - position(entry.start)}%`,
                        }}
                      >
                        {entry.label}
                      </span>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </figure>
  )
}
