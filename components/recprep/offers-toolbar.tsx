"use client"

import { ArrowUpDown, ChevronDown, LayoutGrid, List, RotateCcw, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { EmploymentType, SortKey, ViewMode, WorkMode } from "@/lib/recprep/types"
import { cn } from "@/lib/utils"

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "updated", label: "Ostatnio aktualizowane" },
  { value: "interview", label: "Najbliższa rozmowa" },
  { value: "company", label: "Firma (A–Z)" },
  { value: "title", label: "Stanowisko (A–Z)" },
]

const MODE_OPTIONS: { value: WorkMode | "all"; label: string }[] = [
  { value: "all", label: "Wszystkie" },
  { value: "remote", label: "Zdalnie" },
  { value: "hybrid", label: "Hybrydowo" },
  { value: "onsite", label: "Stacjonarnie" },
]

const EMPLOYMENT_FILTER_OPTIONS: { value: EmploymentType | "all"; label: string }[] = [
  { value: "all", label: "Wszystkie" },
  { value: "B2B", label: "B2B" },
  { value: "UoP", label: "UoP" },
  { value: "Kontrakt", label: "Kontrakt" },
]

function FilterMenu<T extends string>({
  label,
  value,
  options,
  onChange,
  icon,
}: {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
  icon?: React.ReactNode
}) {
  const current = options.find((o) => o.value === value)
  const isActive = value !== "all" && value !== "updated"
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn("h-9 gap-1.5 font-normal", isActive && "border-foreground/30 bg-muted")}
          />
        }
      >
        {icon}
        <span className="text-muted-foreground">{label}:</span>
        <span className="font-medium">{current?.label}</span>
        <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{label}</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={value} onValueChange={(v) => onChange(v as T)}>
            {options.map((o) => (
              <DropdownMenuRadioItem key={o.value} value={o.value} closeOnClick>
                {o.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type Props = {
  query: string
  onQueryChange: (v: string) => void
  sort: SortKey
  onSortChange: (v: SortKey) => void
  mode: WorkMode | "all"
  onModeChange: (v: WorkMode | "all") => void
  employment: EmploymentType | "all"
  onEmploymentChange: (v: EmploymentType | "all") => void
  view: ViewMode
  onViewChange: (v: ViewMode) => void
  hasActiveFilters: boolean
  onClear: () => void
}

export function OffersToolbar(props: Props) {
  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
      <div className="relative w-full lg:max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <label htmlFor="offer-search" className="sr-only">
          Szukaj ofert
        </label>
        <input
          id="offer-search"
          type="search"
          value={props.query}
          onChange={(e) => props.onQueryChange(e.target.value)}
          placeholder="Szukaj po stanowisku, firmie, mieście, notatce..."
          className="h-9 w-full rounded-lg border bg-background pr-9 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-search-cancel-button]:hidden"
        />
        {props.query && (
          <button
            type="button"
            onClick={() => props.onQueryChange("")}
            aria-label="Wyczyść wyszukiwanie"
            className="absolute top-1/2 right-1.5 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-3.5" aria-hidden />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:flex-1">
        <FilterMenu
          label="Sortuj"
          value={props.sort}
          options={SORT_OPTIONS}
          onChange={props.onSortChange}
          icon={<ArrowUpDown className="size-3.5 text-muted-foreground" aria-hidden />}
        />
        <FilterMenu label="Tryb pracy" value={props.mode} options={MODE_OPTIONS} onChange={props.onModeChange} />
        <FilterMenu
          label="Forma"
          value={props.employment}
          options={EMPLOYMENT_FILTER_OPTIONS}
          onChange={props.onEmploymentChange}
        />
        {props.hasActiveFilters && (
          <Button variant="ghost" size="sm" className="h-9 text-muted-foreground" onClick={props.onClear}>
            <RotateCcw aria-hidden />
            Wyczyść filtry
          </Button>
        )}

        <div
          role="group"
          aria-label="Widok"
          className="ml-auto inline-flex h-9 items-center rounded-lg border bg-muted/40 p-0.5"
        >
          {(
            [
              { value: "grid", label: "Siatka", icon: LayoutGrid },
              { value: "list", label: "Lista", icon: List },
            ] as const
          ).map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              aria-pressed={props.view === value}
              aria-label={`Widok: ${label}`}
              onClick={() => props.onViewChange(value)}
              className={cn(
                "inline-flex h-full items-center gap-1.5 rounded-md px-2.5 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                props.view === value
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4" aria-hidden />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
