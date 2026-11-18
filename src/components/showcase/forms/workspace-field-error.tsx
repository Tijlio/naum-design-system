import { MotionFadeUp } from "@/components/ui/motion"

export const WorkspaceFieldError = ({
  id,
  message,
}: {
  id: string
  message?: string
}) =>
  message ? (
    <MotionFadeUp offset={0}>
      <p
        id={id}
        role="alert"
        tabIndex={-1}
        data-form-error
        className="text-sm text-destructive"
      >
        {message}
      </p>
    </MotionFadeUp>
  ) : null
