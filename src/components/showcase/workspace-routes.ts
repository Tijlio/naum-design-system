export const CRM_ROUTES = [
  { label: "Overview", href: "/showcase/crm", icon: "overview" },
  { label: "Contacts", href: "/showcase/crm/contacts", icon: "contacts" },
  { label: "Tasks", href: "/showcase/crm/tasks", icon: "tasks" },
  { label: "Pipeline", href: "/showcase/crm/pipeline", icon: "pipeline" },
] as const
export const routeActive = (path: string, href: string) =>
  path === href || (href !== "/showcase/crm" && path.startsWith(`${href}/`))
export const workspaceBreadcrumbs = (path: string) => {
  const home = { label: "Workspace", href: "/showcase/crm" }
  if (path.startsWith("/showcase/calendar"))
    return [home, { label: "Calendar", href: "/showcase/calendar" }]
  const route = [...CRM_ROUTES]
    .sort((a, b) => b.href.length - a.href.length)
    .find((route) => routeActive(path, route.href))
  return route ? [home, { label: "CRM", href: "/showcase/crm" }, route] : [home]
}
