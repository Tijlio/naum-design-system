"use client"

import { useId, type ComponentProps } from "react"
import { Search } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export type SearchInputProps = Omit<
  ComponentProps<typeof InputGroupInput>,
  "type"
> & { label: string }

export const SearchInput = ({
  label,
  id,
  className,
  disabled,
  ...props
}: SearchInputProps) => {
  const generatedId = useId()
  const inputId = id ?? generatedId
  return (
    <InputGroup
      data-slot="search-input"
      data-disabled={disabled || undefined}
      className={cn("w-full max-w-sm", className)}
    >
      <Label htmlFor={inputId} className="sr-only">
        {label}
      </Label>
      <InputGroupAddon aria-hidden>
        <Search />
      </InputGroupAddon>
      <InputGroupInput
        id={inputId}
        type="search"
        disabled={disabled}
        autoComplete="off"
        spellCheck={false}
        placeholder="Search…"
        className="[&::-webkit-search-cancel-button]:appearance-none"
        {...props}
      />
    </InputGroup>
  )
}
