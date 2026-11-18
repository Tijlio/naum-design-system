"use client"

import type { ComponentProps } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SelectOption<Value extends string> = {
  value: Value
  label: string
  disabled?: boolean
}

export const SelectControl = <Value extends string>({
  items,
  value,
  defaultValue,
  onValueChange,
  name,
  placeholder,
  ...triggerProps
}: Pick<
  ComponentProps<typeof SelectTrigger>,
  | "id"
  | "disabled"
  | "className"
  | "aria-label"
  | "aria-describedby"
  | "aria-invalid"
> & {
  items: readonly SelectOption<Value>[]
  value?: Value | null
  defaultValue?: Value
  onValueChange?: (value: Value | null) => void
  name?: string
  placeholder?: string
}) => (
  <Select
    items={items}
    value={value}
    defaultValue={defaultValue}
    onValueChange={onValueChange}
    name={name}
    disabled={triggerProps.disabled}
  >
    <SelectTrigger {...triggerProps}>
      <SelectValue
        placeholder={
          value === "" || (value === undefined && defaultValue === "")
            ? (items.find((item) => item.value === "")?.label ?? placeholder)
            : placeholder
        }
      />
    </SelectTrigger>
    <SelectContent>
      {items.map((item) => (
        <SelectItem
          key={item.value}
          value={item.value}
          disabled={item.disabled}
        >
          {item.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)
