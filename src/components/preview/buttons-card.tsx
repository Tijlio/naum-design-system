"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Kbd } from "@/components/ui/kbd"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ButtonsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Buttons &amp; Badges</CardTitle>
        <CardDescription>
          All variants including glass &amp; glow
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="glass">Glass</Button>
          <Button variant="glow">Glow</Button>
        </div>

        <Separator />

        <div className="flex flex-wrap items-center gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Error</Badge>
          <Kbd>⌘K</Kbd>
          <Spinner />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <ButtonGroup>
            <Button variant="outline" size="sm">
              Day
            </Button>
            <Button variant="outline" size="sm">
              Week
            </Button>
            <Button variant="outline" size="sm">
              Month
            </Button>
          </ButtonGroup>

          <ToggleGroup defaultValue={["bold"]} size="sm">
            <ToggleGroupItem value="bold">A</ToggleGroupItem>
            <ToggleGroupItem value="italic">B</ToggleGroupItem>
            <ToggleGroupItem value="underline">C</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardContent>
    </Card>
  )
}
