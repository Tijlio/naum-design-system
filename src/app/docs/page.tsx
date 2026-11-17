import registry from "../../../registry.json"
import { ComponentExplorer } from "@/components/docs/component-explorer"

export default function DocumentationPage() {
  const entries = registry.items.flatMap((item) => {
    const file = "files" in item ? item.files?.[0] : undefined
    if (!file || !["registry:ui", "registry:block"].includes(item.type))
      return []
    return [
      {
        name: item.name,
        title: item.title,
        description: item.description,
        path: file.path,
        block: item.type === "registry:block",
      },
    ]
  })
  return <ComponentExplorer entries={entries} />
}
