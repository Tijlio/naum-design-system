"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CalendarCard() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2026, 10, 17)
  )

  return (
    <Card className="items-center">
      <CardHeader className="w-full">
        <CardTitle>Calendar</CardTitle>
        <CardDescription>Date selection styled with theme tokens</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-2xl border border-border/60 bg-background/40"
        />
      </CardContent>
    </Card>
  )
}
