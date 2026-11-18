"use client"

import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { toast } from "sonner"
import { workspaceActionError } from "./workspace-feedback"
import { Button } from "@/components/ui/button"

type NoticeOptions = {
  description?: string
  action?: { label: string; onClick: () => void; confirmation?: string }
}
type Notify = (title: string, options?: NoticeOptions) => void
const NoticeContext = createContext<Notify | null>(null)

const notifyGlobally: Notify = (title, options) => {
  const action = options?.action
  toast.success(title, {
    description: options?.description,
    action: action && {
      label: action.label,
      onClick: () => {
        try {
          action.onClick()
          if (action.confirmation) toast.success(action.confirmation)
        } catch (error) {
          toast.error(workspaceActionError(error))
        }
      },
    },
  })
}

export const useWorkspaceNotice = () =>
  useContext(NoticeContext) ?? notifyGlobally

// A modal hides the global notification region from keyboard and assistive tech.
export const WorkspaceNotice = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  const [notice, setNotice] = useState<
    (NoticeOptions & { title: string; origin: HTMLElement | null }) | null
  >(null)
  const status = useRef<HTMLDivElement>(null)
  return (
    <NoticeContext.Provider
      value={(title, options) =>
        setNotice({
          ...options,
          title,
          origin:
            document.activeElement instanceof HTMLElement
              ? document.activeElement
              : null,
        })
      }
    >
      <div className={className ?? "contents"}>
        {children}
        <div
          className={
            notice
              ? "mt-3 flex flex-wrap items-center justify-between gap-2 text-sm"
              : "sr-only"
          }
        >
          <div ref={status} tabIndex={-1} role="status" aria-atomic="true">
            {notice && (
              <>
                {notice.title}
                {notice.description && <> · {notice.description}</>}
              </>
            )}
          </div>
          {notice?.action && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const action = notice.action
                if (!action) return
                try {
                  action.onClick()
                } catch (error) {
                  status.current?.focus()
                  setNotice({
                    title: workspaceActionError(error),
                    origin: null,
                  })
                  return
                }
                if (action.confirmation) {
                  const target = notice.origin?.isConnected
                    ? notice.origin
                    : status.current
                  target?.focus()
                  setNotice({ title: action.confirmation, origin: null })
                }
              }}
            >
              {notice.action.label}
            </Button>
          )}
        </div>
      </div>
    </NoticeContext.Provider>
  )
}
