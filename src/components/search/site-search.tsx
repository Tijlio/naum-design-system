"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowUpRight, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  MotionExpand,
  MotionFadeUp,
  MotionPresence,
} from "@/components/ui/motion"
import { PAGE_ENTRIES, type SearchEntry } from "./search-entries"

const GROUPS = ["Pages", "Contacts", "Deals", "Appointments", "Tasks"] as const

export const SiteSearch = ({
  entries = PAGE_ENTRIES,
}: {
  entries?: SearchEntry[]
}) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const trigger = useRef<HTMLButtonElement>(null)
  const container = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const panelId = useId()
  const close = useCallback(() => {
    setOpen(false)
    setQuery("")
    trigger.current?.focus()
  }, [])

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        if (
          !open &&
          document.querySelector(
            '[role="dialog"][data-open], [role="alertdialog"][data-open]',
          )
        )
          return
        event.preventDefault()
        if (open) close()
        else {
          setOpen(true)
        }
      }
    }
    document.addEventListener("keydown", keydown)
    return () => document.removeEventListener("keydown", keydown)
  }, [open, close])

  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !container.current?.contains(event.target)
      ) {
        setOpen(false)
        setQuery("")
      }
    }
    document.addEventListener("pointerdown", outside)
    return () => document.removeEventListener("pointerdown", outside)
  }, [open])

  return (
    <div
      className="site-search"
      data-open={open ? "" : undefined}
      ref={container}
      onBlur={(event) => {
        if (
          open &&
          event.relatedTarget &&
          !event.currentTarget.contains(event.relatedTarget)
        ) {
          setOpen(false)
          setQuery("")
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation()
          close()
        }
      }}
    >
      <div aria-hidden className="site-search-backdrop" onClick={close} />
      <Button
        ref={trigger}
        className="relative"
        variant="glass"
        size="icon-sm"
        aria-label="Search"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => {
          if (open) close()
          else {
            setOpen(true)
          }
        }}
      >
        <Search className="size-3.5" />
      </Button>
      <MotionPresence initial={false}>
        {open && (
          <MotionFadeUp
            id={panelId}
            className="site-search-expand"
            exit={{ opacity: 0 }}
            key="search"
          >
            <Command
              label="Search workspace"
              className="w-full overflow-visible rounded-full bg-transparent p-0"
            >
              <MotionExpand axis="x" className="min-w-full">
                <div className="flex items-center gap-1">
                  <CommandInput
                    variant="inline"
                    autoFocus
                    aria-label="Search workspace"
                    placeholder="Search anything…"
                    value={query}
                    onValueChange={setQuery}
                  />
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Close search"
                    onClick={close}
                  >
                    <X />
                  </Button>
                </div>
              </MotionExpand>
              <CommandList className="site-search-results">
                <CommandEmpty>No results found.</CommandEmpty>
                {GROUPS.filter((group) =>
                  entries.some((entry) => entry.group === group),
                ).map((group) => (
                  <CommandGroup key={group} heading={group}>
                    {entries
                      .filter((entry) => entry.group === group)
                      .map((entry) => (
                        <CommandItem
                          key={entry.id}
                          value={entry.id}
                          keywords={[entry.title, entry.description ?? ""]}
                          onSelect={() => {
                            close()
                            router.push(entry.href)
                          }}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="truncate">{entry.title}</div>
                            {entry.description && (
                              <div className="truncate text-xs text-muted-foreground">
                                {entry.description}
                              </div>
                            )}
                          </div>
                          <ArrowUpRight className="text-muted-foreground" />
                        </CommandItem>
                      ))}
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
          </MotionFadeUp>
        )}
      </MotionPresence>
    </div>
  )
}
