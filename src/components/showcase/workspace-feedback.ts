import { toast } from "sonner"
import { WorkspaceValidationError } from "./workspace-validation"

// Toast actions outlive their originating view; relationships may have changed.
export const withWorkspaceRecovery = (action: () => void) => () => {
  try {
    action()
  } catch (error) {
    toast.error(
      error instanceof WorkspaceValidationError
        ? error.message
        : "Could not apply this action. Try again.",
    )
  }
}
