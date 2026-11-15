"use client"

import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { STATUS_META, STATUS_ORDER } from "@/lib/recprep/format"
import type { ApplicationStatus } from "@/lib/recprep/types"
import { cn } from "@/lib/utils"

export function StatusDot({ status, className }: { status: ApplicationStatus; className?: string }) {
  return <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", STATUS_META[status].dot, className)} />
}

export function StatusPill({
  status,
  onChange,
  className,
}: {
  status: ApplicationStatus
  onChange: (status: ApplicationStatus) => void
  className?: string
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Status: ${STATUS_META[status].label}. Zmień status`}
        className={cn(
          "relative z-10 inline-flex h-6 items-center gap-1.5 rounded-full border bg-background px-2 text-xs font-medium text-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 aria-expanded:bg-muted",
          className,
        )}
      >
        <StatusDot status={status} />
        {STATUS_META[status].label}
        <ChevronDown className="size-3 text-muted-foreground" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Status aplikacji</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={status} onValueChange={(value) => onChange(value as ApplicationStatus)}>
            {STATUS_ORDER.map((s) => (
              <DropdownMenuRadioItem key={s} value={s} closeOnClick>
                <StatusDot status={s} />
                {STATUS_META[s].label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
