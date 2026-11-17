"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

const FRAMEWORKS = ["Next.js", "Vite", "Remix", "Astro", "TanStack Start"]

export function AdvancedFormsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Field, Combobox &amp; NativeSelect</CardTitle>
        <CardDescription>
          Structured form fields and searchable selection
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel htmlFor="field-workspace">Workspace</FieldLabel>
            <Input
              id="field-workspace"
              aria-describedby="workspace-description"
              defaultValue="Naum Design"
            />
            <FieldDescription id="workspace-description">
              Displayed in the top navigation bar.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="field-framework">
              Framework (Combobox)
            </FieldLabel>
            <Combobox items={FRAMEWORKS} defaultValue="Next.js">
              <ComboboxInput
                id="field-framework"
                placeholder="Select framework..."
              />
              <ComboboxContent>
                <ComboboxEmpty>No framework found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>

          <Field>
            <FieldLabel htmlFor="native-currency">
              Currency (NativeSelect)
            </FieldLabel>
            <NativeSelect id="native-currency" defaultValue="EUR">
              <NativeSelectOption value="EUR">EUR (€)</NativeSelectOption>
              <NativeSelectOption value="USD">USD ($)</NativeSelectOption>
              <NativeSelectOption value="GBP">GBP (£)</NativeSelectOption>
            </NativeSelect>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}
