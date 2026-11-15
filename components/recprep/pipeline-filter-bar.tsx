"use client"

import type { PipelineFilter } from "@/lib/recprep/types"
import { cn } from "@/lib/utils"

export const PIPELINE_FILTERS: { key: PipelineFilter; label: string }[] = [
  { key: "all", label: "Wszystkie" },
  { key: "saved", label: "Zapisane" },
  { key: "applied", label: "Wysłane CV" },
  { key: "interview", label: "Rozmowy" },
  { key: "offer", label: "Oferty" },
  { key: "favorite", label: "Ulubione" },
  { key: "noCv", label: "Bez CV" },
]

export function PipelineFilterBar({
  value,
  counts,
  onChange,
}: {
  value: PipelineFilter
  counts: Record<PipelineFilter, number>
  onChange: (value: PipelineFilter) => void
}) {
  return (
    <div role="group" aria-label="Filtruj etap rekrutacji" className="flex flex-wrap gap-1.5">
      {PIPELINE_FILTERS.map(({ key, label }) => {
        const active = value === key
        return (
          <button
            key={key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(key)}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              active
                ? "border-foreground bg-foreground text-background"
                : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {label}
            <span className={cn("text-xs tabular-nums", active ? "text-background/70" : "text-muted-foreground/80")}>
              {counts[key]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
