import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export const ContactAvatar = ({
  name,
  className,
  onMesh = false,
}: {
  name: string
  className?: string
  onMesh?: boolean
}) => (
  <Avatar className={className}>
    <AvatarFallback variant={onMesh ? "mesh" : "soft"} tone="lavender">
      {name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")}
    </AvatarFallback>
  </Avatar>
)
