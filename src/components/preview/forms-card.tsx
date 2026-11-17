"use client"

import * as React from "react"
import { Search } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export function FormsCard() {
  const [notifications, setNotifications] = React.useState(true)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Inputs</CardTitle>
        <CardDescription>
          Subtle `--input` borders and focus rings
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3.5">
        <div className="grid gap-1.5">
          <Label htmlFor="preview-search">Search</Label>
          <InputGroup>
            <InputGroupAddon>
              <Search className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              id="preview-search"
              placeholder="Search user or record..."
            />
          </InputGroup>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="preview-name">Name</Label>
            <Input id="preview-name" defaultValue="Alex Mercer" />
          </div>
          <div className="grid gap-1.5">
            <Label>Region</Label>
            <Select defaultValue="eu-west">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eu-west">EU West</SelectItem>
                <SelectItem value="eu-central">EU Central</SelectItem>
                <SelectItem value="us-east">US East</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="preview-notes">Notes</Label>
          <Textarea
            id="preview-notes"
            placeholder="Optional context..."
            rows={2}
          />
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <Checkbox id="preview-check" defaultChecked />
            <Label htmlFor="preview-check">Confirmed</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="preview-switch"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
            <Label htmlFor="preview-switch">Notifications</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
