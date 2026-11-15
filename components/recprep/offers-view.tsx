"use client"

import { useMemo, useState } from "react"
import { Plus, SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddJobModal, type NewJobInput } from "./add-job-modal"
import { JobOfferCard } from "./job-offer-card"
import { JobOfferDetailModal } from "./job-offer-detail-modal"
import { JobOfferList } from "./job-offer-list"
import { OffersToolbar } from "./offers-toolbar"
import { PipelineFilterBar } from "./pipeline-filter-bar"
import { STATUS_META, WORK_MODE_LABEL } from "@/lib/recprep/format"
import type {
  BaseResume,
  EmploymentType,
  JobOffer,
  PipelineFilter,
  SortKey,
  ViewMode,
  WorkMode,
} from "@/lib/recprep/types"

function matchesPipeline(offer: JobOffer, filter: PipelineFilter) {
  switch (filter) {
    case "all":
      return true
    case "favorite":
      return offer.favorite
    case "noCv":
      return offer.linkedCvs.length === 0
    default:
      return offer.status === filter
  }
}

const collator = new Intl.Collator("pl")

function sortOffers(offers: JobOffer[], sort: SortKey) {
  const list = [...offers]
  switch (sort) {
    case "company":
      return list.sort((a, b) => collator.compare(a.company, b.company))
    case "title":
      return list.sort((a, b) => collator.compare(a.title, b.title))
    case "interview":
      return list.sort((a, b) => {
        if (!a.interviewAt && !b.interviewAt) return b.updatedAt.localeCompare(a.updatedAt)
        if (!a.interviewAt) return 1
        if (!b.interviewAt) return -1
        return a.interviewAt.localeCompare(b.interviewAt)
      })
    default:
      return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  }
}

type Props = {
  offers: JobOffer[]
  resumes: BaseResume[]
  pipeline: PipelineFilter
  onPipelineChange: (v: PipelineFilter) => void
  onUpdate: (id: string, patch: Partial<JobOffer>) => void
  onDelete: (id: string) => void
  onAdd: (input: NewJobInput) => void
}

export function OffersView({ offers, resumes, pipeline, onPipelineChange, onUpdate, onDelete, onAdd }: Props) {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortKey>("updated")
  const [mode, setMode] = useState<WorkMode | "all">("all")
  const [employment, setEmployment] = useState<EmploymentType | "all">("all")
  const [view, setView] = useState<ViewMode>("grid")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  const counts = useMemo(() => {
    const keys: PipelineFilter[] = ["all", "saved", "applied", "interview", "offer", "favorite", "noCv"]
    return Object.fromEntries(keys.map((k) => [k, offers.filter((o) => matchesPipeline(o, k)).length])) as Record<
      PipelineFilter,
      number
    >
  }, [offers])

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("pl")
    const filtered = offers.filter((o) => {
      if (!matchesPipeline(o, pipeline)) return false
      if (mode !== "all" && o.workMode !== mode) return false
      if (employment !== "all" && o.employment !== employment) return false
      if (!q) return true
      const haystack = [o.title, o.company, o.location, o.notes, o.workMode && WORK_MODE_LABEL[o.workMode], STATUS_META[o.status].label]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("pl")
      return haystack.includes(q)
    })
    return sortOffers(filtered, sort)
  }, [offers, pipeline, mode, employment, query, sort])

  const hasActiveFilters = query !== "" || mode !== "all" || employment !== "all" || pipeline !== "all" || sort !== "updated"
  const selected = offers.find((o) => o.id === selectedId) ?? null

  function clearFilters() {
    setQuery("")
    setMode("all")
    setEmployment("all")
    setSort("updated")
    onPipelineChange("all")
  }

  function handleDelete(id: string) {
    if (selectedId === id) setSelectedId(null)
    onDelete(id)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">Baza ofert pracy</h1>
          <p className="mt-1 text-sm text-muted-foreground text-pretty">
            Wszystkie Twoje rekrutacje, notatki i dopasowane CV w jednym miejscu.
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="h-9 self-start sm:self-auto">
          <Plus aria-hidden />
          Dodaj nową ofertę
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <PipelineFilterBar value={pipeline} counts={counts} onChange={onPipelineChange} />
        <OffersToolbar
          query={query}
          onQueryChange={setQuery}
          sort={sort}
          onSortChange={setSort}
          mode={mode}
          onModeChange={setMode}
          employment={employment}
          onEmploymentChange={setEmployment}
          view={view}
          onViewChange={setView}
          hasActiveFilters={hasActiveFilters}
          onClear={clearFilters}
        />
      </div>

      <p className="sr-only" aria-live="polite">
        Wyświetlono {visible.length} z {offers.length} ofert
      </p>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center">
          <SearchX className="size-6 text-muted-foreground" aria-hidden />
          <div>
            <p className="text-sm font-medium">Brak ofert spełniających kryteria</p>
            <p className="mt-1 text-sm text-muted-foreground">Zmień filtry lub dodaj nową ofertę.</p>
          </div>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Wyczyść filtry
            </Button>
          )}
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((offer) => (
            <JobOfferCard
              key={offer.id}
              offer={offer}
              onOpen={() => setSelectedId(offer.id)}
              onStatusChange={(status) => onUpdate(offer.id, { status })}
              onToggleFavorite={() => onUpdate(offer.id, { favorite: !offer.favorite })}
              onDelete={() => handleDelete(offer.id)}
            />
          ))}
        </div>
      ) : (
        <JobOfferList
          offers={visible}
          onOpen={setSelectedId}
          onStatusChange={(id, status) => onUpdate(id, { status })}
          onToggleFavorite={(id) => onUpdate(id, { favorite: !offers.find((o) => o.id === id)?.favorite })}
          onDelete={handleDelete}
        />
      )}

      <JobOfferDetailModal
        offer={selected}
        resumes={resumes}
        onClose={() => setSelectedId(null)}
        onUpdate={onUpdate}
        onDelete={handleDelete}
      />
      <AddJobModal open={addOpen} onOpenChange={setAddOpen} onSubmit={onAdd} />
    </div>
  )
}
