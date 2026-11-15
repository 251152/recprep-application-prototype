"use client"

import { ArrowUpRight, CalendarClock, FileText, Trash2 } from "lucide-react"
import { ConditionPills } from "./condition-pills"
import { FavoriteButton } from "./favorite-button"
import { StatusPill } from "./status-pill"
import { formatInterview } from "@/lib/recprep/format"
import type { ApplicationStatus, JobOffer } from "@/lib/recprep/types"
import { cn } from "@/lib/utils"

type Props = {
  offers: JobOffer[]
  onOpen: (id: string) => void
  onStatusChange: (id: string, status: ApplicationStatus) => void
  onToggleFavorite: (id: string) => void
  onDelete: (id: string) => void
}

export function JobOfferList({ offers, onOpen, onStatusChange, onToggleFavorite, onDelete }: Props) {
  return (
    <ul className="divide-y overflow-hidden rounded-xl border bg-card">
      {offers.map((offer) => (
        <li
          key={offer.id}
          className="relative flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted/40 sm:px-4"
        >
          <FavoriteButton
            active={offer.favorite}
            onToggle={() => onToggleFavorite(offer.id)}
            label={offer.title}
            className="-ml-1"
          />

          <div className="min-w-0 flex-1 sm:w-56 sm:flex-none lg:w-64">
            <button
              type="button"
              onClick={() => onOpen(offer.id)}
              className="block w-full truncate text-left text-sm font-medium outline-none after:absolute after:inset-0 focus-visible:after:ring-3 focus-visible:after:ring-ring/50 focus-visible:after:ring-inset"
            >
              {offer.title}
            </button>
            <p className="truncate text-xs text-muted-foreground">
              {offer.company} <span aria-hidden>•</span> {offer.language}
            </p>
          </div>

          <StatusPill status={offer.status} onChange={(s) => onStatusChange(offer.id, s)} className="shrink-0" />

          <div className="hidden min-w-0 flex-1 items-center gap-1.5 sm:flex">
            {offer.interviewAt && (
              <span className="inline-flex h-6 shrink-0 items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-1.5 text-xs font-medium whitespace-nowrap text-amber-700 dark:text-amber-300">
                <CalendarClock className="size-3.5" aria-hidden />
                {formatInterview(offer.interviewAt)}
              </span>
            )}
            <ConditionPills
              offer={offer}
              className="min-w-0 flex-nowrap overflow-hidden"
              hide={{
                salary: "hidden md:inline-flex",
                workMode: "hidden lg:inline-flex",
                employment: "hidden xl:inline-flex",
                location: "hidden 2xl:inline-flex",
              }}
            />
          </div>

          <div className="relative z-10 ml-auto flex shrink-0 items-center gap-1">
            <span
              className={cn(
                "hidden h-6 items-center gap-1 rounded-md px-1.5 text-xs md:inline-flex",
                offer.linkedCvs.length ? "text-foreground" : "text-muted-foreground",
              )}
              title="Powiązane CV"
            >
              <FileText className="size-3.5" aria-hidden />
              {offer.linkedCvs.length}
              <span className="sr-only">powiązanych CV</span>
            </span>
            {offer.url ? (
              <a
                href={offer.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ogłoszenie ${offer.company} (otwiera się w nowej karcie)`}
                className="hidden size-7 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 sm:inline-flex"
              >
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            ) : (
              <span className="hidden size-7 sm:inline-block" aria-hidden />
            )}
            <button
              type="button"
              onClick={() => onDelete(offer.id)}
              aria-label={`Usuń ofertę ${offer.title}`}
              className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-destructive focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Trash2 className="size-4" aria-hidden />
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
