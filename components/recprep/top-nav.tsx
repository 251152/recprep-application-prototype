"use client"

import { BriefcaseBusiness, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import type { AppTab } from "@/lib/recprep/types"
import { cn } from "@/lib/utils"

const TABS: { key: AppTab | "analytics"; label: string; disabled?: boolean }[] = [
  { key: "offers", label: "Oferty pracy" },
  { key: "resumes", label: "CV bazowe" },
  { key: "analytics", label: "Analizy", disabled: true },
]

function NavTabs({ tab, onTabChange, className }: { tab: AppTab; onTabChange: (t: AppTab) => void; className?: string }) {
  return (
    <nav aria-label="Główna nawigacja" className={className}>
      <ul className="flex items-center gap-1">
        {TABS.map((t) => {
          const active = t.key === tab
          return (
            <li key={t.key}>
              <button
                type="button"
                disabled={t.disabled}
                aria-current={active ? "page" : undefined}
                onClick={() => !t.disabled && onTabChange(t.key as AppTab)}
                className={cn(
                  "relative inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  active ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
                  t.disabled && "cursor-not-allowed hover:text-muted-foreground",
                )}
              >
                {t.label}
                {t.disabled && (
                  <span className="rounded-full border px-1.5 py-px text-[10px] leading-none font-medium text-muted-foreground">
                    Wkrótce
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export function TopNav({ tab, onTabChange }: { tab: AppTab; onTabChange: (t: AppTab) => void }) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="flex h-14 w-full items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex shrink-0 items-center gap-2">
          <span className="inline-flex size-6 items-center justify-center rounded-md bg-foreground text-background">
            <BriefcaseBusiness className="size-3.5" aria-hidden />
          </span>
          <span className="text-sm font-semibold tracking-tight">RecPrep</span>
        </div>

        <span aria-hidden className="hidden h-5 w-px bg-border md:block" />
        <NavTabs tab={tab} onTabChange={onTabChange} className="hidden md:block" />

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Przełącz motyw jasny / ciemny"
            className="inline-flex size-8 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Sun className="size-4 dark:hidden" aria-hidden />
            <Moon className="hidden size-4 dark:block" aria-hidden />
          </button>
          <div className="flex items-center gap-2 rounded-md py-1 pr-1 pl-1 sm:pr-2">
            <span
              aria-hidden
              className="inline-flex size-7 items-center justify-center rounded-full border bg-muted text-[11px] font-semibold"
            >
              JK
            </span>
            <span className="hidden text-sm font-medium sm:inline">Jan Kowalski</span>
            <span className="sr-only sm:hidden">Jan Kowalski</span>
          </div>
        </div>
      </div>

      <div className="w-full border-t px-2 py-1.5 md:hidden">
        <NavTabs tab={tab} onTabChange={onTabChange} className="overflow-x-auto" />
      </div>
    </header>
  )
}
