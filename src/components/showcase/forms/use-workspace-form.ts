"use client"

import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import {
  WorkspaceValidationError,
  type WorkspaceFieldErrors,
} from "../workspace-validation"

const nativeErrors = (form: HTMLFormElement): WorkspaceFieldErrors => {
  const errors: WorkspaceFieldErrors = {}
  for (const element of Array.from(form.elements)) {
    if (
      !(
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement
      ) ||
      !element.name ||
      element.validity.valid
    )
      continue
    const validity = element.validity
    errors[element.name] = validity.valueMissing
      ? "Complete this field."
      : validity.typeMismatch
        ? "Enter a valid email address."
        : validity.rangeUnderflow || validity.rangeOverflow
          ? `Enter a value between ${element.getAttribute("min")} and ${element.getAttribute("max")}.`
          : validity.stepMismatch
            ? "Use at most two decimal places."
            : "Check this value."
  }
  return errors
}

export const useWorkspaceForm = (onClose: () => void) => {
  const id = useId()
  const [errors, setErrors] = useState<WorkspaceFieldErrors>({})
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)
  const locked = useRef(false)
  const leave = useRef(onClose)
  const discardReturnFocus = useRef<HTMLElement | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  useEffect(() => {
    if (!dirty) return
    const preventLoss = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", preventLoss)
    return () => window.removeEventListener("beforeunload", preventLoss)
  }, [dirty])
  const markDirty = (field?: string) => {
    setDirty(true)
    if (field)
      setErrors((current) => {
        const next = { ...current }
        delete next[field]
        delete next._form
        return next
      })
  }
  const requestLeave = (action = onClose) => {
    if (locked.current) return
    leave.current = action
    if (dirty) {
      discardReturnFocus.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null
      setDiscardOpen(true)
    } else action()
  }
  const submit =
    (
      save: (data: FormData) => void | Promise<void>,
      { closeOnSuccess = true } = {},
    ) =>
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      event.stopPropagation()
      if (locked.current) return
      locked.current = true
      const element = event.currentTarget
      try {
        const invalid = nativeErrors(element)
        if (Object.keys(invalid).length)
          throw new WorkspaceValidationError(invalid)
        setErrors({})
        setSaving(true)
        await save(new FormData(element))
        setDirty(false)
        if (closeOnSuccess) onClose()
        else {
          locked.current = false
          setSaving(false)
          formRef.current?.reset()
        }
        // Retain the lock until unmount; a queued second submit cannot duplicate a record.
      } catch (error) {
        setErrors(
          error instanceof WorkspaceValidationError
            ? error.fields
            : { _form: "Could not save your changes. Try again." },
        )
        locked.current = false
        setSaving(false)
        requestAnimationFrame(() =>
          formRef.current
            ?.querySelector<HTMLElement>(
              '[aria-invalid="true"], [data-form-error]',
            )
            ?.focus(),
        )
      }
    }
  return {
    dirty,
    saving,
    submit,
    markDirty,
    requestLeave,
    requestClose: () => requestLeave(onClose),
    field: (name: string) => ({
      "aria-invalid": Boolean(errors[name]),
      "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
    }),
    error: (name: string) => ({
      id: `${id}-${name}-error`,
      message: errors[name],
    }),
    formProps: {
      ref: formRef,
      noValidate: true,
      "aria-busy": saving,
      onChange: (event: FormEvent<HTMLFormElement>) =>
        markDirty(
          event.target instanceof HTMLInputElement ||
            event.target instanceof HTMLTextAreaElement
            ? event.target.name
            : undefined,
        ),
    },
    discardProps: {
      open: discardOpen,
      onOpenChange: setDiscardOpen,
      finalFocus: () =>
        discardReturnFocus.current?.isConnected
          ? discardReturnFocus.current
          : false,
      onDiscard: () => {
        discardReturnFocus.current = null
        setDiscardOpen(false)
        setDirty(false)
        leave.current()
      },
    },
  }
}
