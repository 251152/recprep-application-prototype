"use client"

import { ArrowUpRight, CalendarClock, FileText, StickyNote, Trash2 } from "lucide-react"
import { ConditionPills } from "./condition-pills"
import { FavoriteButton } from "./favorite-button"
import { StatusPill } from "./status-pill"
import { contextDate, formatInterview } from "@/lib/recprep/format"
import type { ApplicationStatus, JobOffer } from "@/lib/recprep/types"
import { cn } from "@/lib/utils"

type Props = {
  offer: JobOffer
  onOpen: () => void
  onStatusChange: (status: ApplicationStatus) => void
  onToggleFavorite: () => void
  onDelete: () => void
}

export function JobOfferCard({ offer, onOpen, onStatusChange, onToggleFavorite, onDelete }: Props) {
  const cvCount = offer.linkedCvs.length

  return (
    <article className="group relative flex flex-col rounded-xl border bg-card text-card-foreground transition-colors hover:border-foreground/20">
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <StatusPill status={offer.status} onChange={onStatusChange} />
          <div className="relative z-10 flex items-center">
            <FavoriteButton active={offer.favorite} onToggle={onToggleFavorite} label={offer.title} />
            <button
              type="button"
              onClick={onDelete}
              aria-label={`Usuń ofertę ${offer.title}`}
              className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-destructive focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Trash2 className="size-4" aria-hidden />
            </button>
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-[15px] leading-snug font-semibold">
            <button
              type="button"
              onClick={onOpen}
              className="text-left outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
            >
              {offer.title}
            </button>
          </h3>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {offer.company} <span aria-hidden>•</span> {offer.language}
          </p>
        </div>

        <ConditionPills offer={offer} />

        <div className="mt-auto rounded-lg border bg-muted/40 p-3">
          {offer.interviewAt && (
            <div className="mb-2 flex items-center gap-1.5 border-b pb-2 text-xs">
              <CalendarClock className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
              <span className="font-medium text-foreground">Rozmowa: {formatInterview(offer.interviewAt)}</span>
              {offer.interviewStage && (
                <span className="truncate text-muted-foreground">· {offer.interviewStage}</span>
              )}
            </div>
          )}
          {offer.notes ? (
            <p className="flex gap-1.5 text-xs leading-relaxed text-foreground/80">
              <StickyNote className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden />
              <span className="line-clamp-2">{offer.notes}</span>
            </p>
          ) : (
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{offer.description}</p>
          )}
        </div>
      </div>

      <footer className="flex h-12 items-center justify-between gap-2 border-t px-4 text-xs">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "inline-flex h-5 shrink-0 items-center gap-1 rounded-md border px-1.5 font-medium",
              cvCount ? "bg-background text-foreground" : "border-dashed text-muted-foreground",
            )}
          >
            <FileText className="size-3" aria-hidden />
            {cvCount ? `${cvCount} CV` : "Brak CV"}
          </span>
          <span className="truncate text-muted-foreground">{contextDate(offer)}</span>
        </div>
        {offer.url && (
          <a
            href={offer.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex shrink-0 items-center gap-0.5 rounded-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Ogłoszenie
            <ArrowUpRight className="size-3.5" aria-hidden />
            <span className="sr-only">(otwiera się w nowej karcie)</span>
          </a>
        )}
      </footer>
    </article>
  )
}
