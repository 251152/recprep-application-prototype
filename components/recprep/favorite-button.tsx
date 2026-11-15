"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export function FavoriteButton({
  active,
  onToggle,
  label,
  className,
}: {
  active: boolean
  onToggle: () => void
  label: string
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      aria-label={active ? `Usuń ${label} z ulubionych` : `Dodaj ${label} do ulubionych`}
      className={cn(
        "relative z-10 inline-flex size-7 items-center justify-center rounded-md transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
        active ? "text-amber-500" : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      <Star className={cn("size-4", active && "fill-current")} aria-hidden />
    </button>
  )
}
