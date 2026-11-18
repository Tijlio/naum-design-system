import { WorkspaceValidationError } from "./workspace-validation"

export const workspaceActionError = (error: unknown) =>
  error instanceof WorkspaceValidationError
    ? error.message
    : "Could not apply this action. Try again."
