"use client"

import { useRef, useState } from "react"
import { ArrowUpRight, Check, ChevronDown, FileText, Loader2, Target, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FavoriteButton } from "./favorite-button"
import { StatusDot } from "./status-pill"
import { EMPLOYMENT_OPTIONS, STATUS_META, STATUS_ORDER, WORK_MODE_LABEL } from "@/lib/recprep/format"
import type { BaseResume, EmploymentType, JobOffer, WorkMode } from "@/lib/recprep/types"
import { cn } from "@/lib/utils"

type Props = {
  offer: JobOffer | null
  resumes: BaseResume[]
  onClose: () => void
  onUpdate: (id: string, patch: Partial<JobOffer>) => void
  onDelete: (id: string) => void
}

const selectClass =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"

function Section({ title, children, aside }: { title: string; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{title}</h3>
        {aside}
      </div>
      {children}
    </section>
  )
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label htmlFor={id} className="text-xs font-normal text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  )
}

export function JobOfferDetailModal({ offer, resumes, onClose, onUpdate, onDelete }: Props) {
  return (
    <Dialog open={offer !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[88vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
      >
        {offer && (
          <DetailBody
            key={offer.id}
            offer={offer}
            resumes={resumes}
            onClose={onClose}
            onUpdate={(patch) => onUpdate(offer.id, patch)}
            onDelete={() => onDelete(offer.id)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function DetailBody({
  offer,
  resumes,
  onClose,
  onUpdate,
  onDelete,
}: {
  offer: JobOffer
  resumes: BaseResume[]
  onClose: () => void
  onUpdate: (patch: Partial<JobOffer>) => void
  onDelete: () => void
}) {
  const [noteState, setNoteState] = useState<"idle" | "saving" | "saved">("idle")
  const [requirementsOpen, setRequirementsOpen] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const id = offer.id

  function handleNoteChange(value: string) {
    onUpdate({ notes: value })
    setNoteState("saving")
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => setNoteState("saved"), 700)
  }

  function tailorCv(resume: BaseResume) {
    const role = resume.targetRole.split(/[/(]/)[0].trim()
    onUpdate({
      linkedCvs: [...offer.linkedCvs, { id: `lcv-${Date.now()}`, name: `${role} — ${offer.company}` }],
    })
  }

  return (
    <>
      <header className="flex flex-col gap-3 border-b bg-popover p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <DialogTitle className="text-base leading-snug font-semibold text-balance">{offer.title}</DialogTitle>
            <DialogDescription className="mt-0.5 text-sm">
              {offer.company} <span aria-hidden>•</span> {offer.language}
            </DialogDescription>
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            <FavoriteButton active={offer.favorite} onToggle={() => onUpdate({ favorite: !offer.favorite })} label={offer.title} />
            <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Zamknij">
              <X aria-hidden />
            </Button>
          </div>
        </div>

        <div
          role="radiogroup"
          aria-label="Status aplikacji"
          className="grid grid-cols-5 gap-0.5 rounded-lg border bg-muted/40 p-0.5"
        >
          {STATUS_ORDER.map((s) => {
            const active = offer.status === s
            return (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onUpdate({ status: s })}
                className={cn(
                  "inline-flex h-7 min-w-0 items-center justify-center gap-1.5 rounded-md px-1 text-xs transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  active
                    ? "bg-background font-medium text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <StatusDot status={s} className="hidden sm:block" />
                <span className="truncate">{STATUS_META[s].label}</span>
              </button>
            )
          })}
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4 sm:p-5">
        <Section title="Przebieg rekrutacji">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field id={`${id}-applied`} label="Data aplikacji">
              <Input
                id={`${id}-applied`}
                type="date"
                value={offer.appliedAt ?? ""}
                onChange={(e) => onUpdate({ appliedAt: e.target.value || null })}
              />
            </Field>
            <Field id={`${id}-interview`} label="Termin rozmowy">
              <Input
                id={`${id}-interview`}
                type="datetime-local"
                value={offer.interviewAt ?? ""}
                onChange={(e) => onUpdate({ interviewAt: e.target.value || null })}
              />
            </Field>
            <Field id={`${id}-stage`} label="Etap rozmowy">
              <Input
                id={`${id}-stage`}
                placeholder="np. Rozmowa techniczna"
                value={offer.interviewStage ?? ""}
                onChange={(e) => onUpdate({ interviewStage: e.target.value || null })}
              />
            </Field>
            <Field id={`${id}-contact`} label="Kontakt do rekrutera">
              <Input
                id={`${id}-contact`}
                placeholder="Imię, e-mail lub telefon"
                value={offer.recruiterContact}
                onChange={(e) => onUpdate({ recruiterContact: e.target.value })}
              />
            </Field>
          </div>
        </Section>

        <Section title="Warunki oferty">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field id={`${id}-salary`} label="Stawka">
              <Input
                id={`${id}-salary`}
                placeholder="np. 18–22 tys. brutto"
                value={offer.salary ?? ""}
                onChange={(e) => onUpdate({ salary: e.target.value || null })}
              />
            </Field>
            <Field id={`${id}-mode`} label="Tryb pracy">
              <select
                id={`${id}-mode`}
                className={selectClass}
                value={offer.workMode ?? ""}
                onChange={(e) => onUpdate({ workMode: (e.target.value || null) as WorkMode | null })}
              >
                <option value="">Nie podano</option>
                {(Object.keys(WORK_MODE_LABEL) as WorkMode[]).map((m) => (
                  <option key={m} value={m}>
                    {WORK_MODE_LABEL[m]}
                  </option>
                ))}
              </select>
            </Field>
            <Field id={`${id}-employment`} label="Forma zatrudnienia">
              <select
                id={`${id}-employment`}
                className={selectClass}
                value={offer.employment ?? ""}
                onChange={(e) => onUpdate({ employment: (e.target.value || null) as EmploymentType | null })}
              >
                <option value="">Nie podano</option>
                {EMPLOYMENT_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field id={`${id}-location`} label="Lokalizacja">
              <Input
                id={`${id}-location`}
                placeholder="np. Warszawa"
                value={offer.location ?? ""}
                onChange={(e) => onUpdate({ location: e.target.value || null })}
              />
            </Field>
          </div>
        </Section>

        <Section
          title="Twoja notatka"
          aside={
            <span aria-live="polite" className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              {noteState === "saving" && (
                <>
                  <Loader2 className="size-3 animate-spin" aria-hidden />
                  Zapisywanie…
                </>
              )}
              {noteState === "saved" && (
                <>
                  <Check className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden />
                  Zapisano
                </>
              )}
            </span>
          }
        >
          <Label htmlFor={`${id}-notes`} className="sr-only">
            Twoja notatka
          </Label>
          <Textarea
            id={`${id}-notes`}
            rows={4}
            placeholder="Pytania do rekrutera, wrażenia po rozmowie, kolejne kroki…"
            value={offer.notes}
            onChange={(e) => handleNoteChange(e.target.value)}
          />
        </Section>

        <Section title="Powiązane CV">
          {offer.linkedCvs.length > 0 ? (
            <ul className="divide-y rounded-lg border">
              {offer.linkedCvs.map((cv) => (
                <li key={cv.id} className="flex items-center gap-2 px-3 py-2 text-sm">
                  <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="min-w-0 flex-1 truncate">{cv.name}</span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Odłącz ${cv.name}`}
                    onClick={() => onUpdate({ linkedCvs: offer.linkedCvs.filter((c) => c.id !== cv.id) })}
                  >
                    <X aria-hidden />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-lg border border-dashed px-3 py-3 text-sm text-muted-foreground">
              Do tej oferty nie dopasowano jeszcze żadnego CV.
            </p>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button className="w-full sm:w-auto sm:self-start" />}>
              <Target aria-hidden />
              Dopasuj CV pod tę ofertę (ATS)
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Wybierz CV bazowe</DropdownMenuLabel>
                {resumes.length === 0 && (
                  <DropdownMenuItem disabled>Brak CV bazowych</DropdownMenuItem>
                )}
                {resumes.map((r) => (
                  <DropdownMenuItem key={r.id} onClick={() => tailorCv(r)}>
                    <FileText aria-hidden />
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate">{r.title}</span>
                      <span className="truncate text-xs text-muted-foreground">{r.targetRole}</span>
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </Section>

        <Collapsible open={requirementsOpen} onOpenChange={setRequirementsOpen} className="rounded-lg border">
          <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50 rounded-lg">
            Wyekstrahowane wymagania
            <ChevronDown
              className={cn("size-4 text-muted-foreground transition-transform", requirementsOpen && "rotate-180")}
              aria-hidden
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-col gap-4 border-t px-3 py-3">
              <RequirementGroup label="Wymagane" items={offer.requirements.required} strong />
              <RequirementGroup label="Mile widziane" items={offer.requirements.niceToHave} />
              <div className="flex flex-col gap-1.5">
                <h4 className="text-xs text-muted-foreground">Treść ogłoszenia</h4>
                <p className="text-sm leading-relaxed text-pretty whitespace-pre-line">{offer.description}</p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <footer className="flex items-center justify-between gap-2 border-t bg-muted/40 px-4 py-3 sm:px-5">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={onDelete}>
          <Trash2 aria-hidden />
          Usuń ofertę
        </Button>
        <div className="flex items-center gap-2">
          {offer.url && (
            <Button
              variant="outline"
              size="sm"
              render={<a href={offer.url} target="_blank" rel="noopener noreferrer" />}
              nativeButton={false}
            >
              Ogłoszenie
              <ArrowUpRight aria-hidden />
            </Button>
          )}
          <Button size="sm" onClick={onClose}>
            Gotowe
          </Button>
        </div>
      </footer>
    </>
  )
}

function RequirementGroup({ label, items, strong }: { label: string; items: string[]; strong?: boolean }) {
  if (items.length === 0) return null
  return (
    <div className="flex flex-col gap-1.5">
      <h4 className="text-xs text-muted-foreground">{label}</h4>
      <ul className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <li
            key={item}
            className={cn(
              "rounded-md border px-1.5 py-0.5 text-xs",
              strong ? "bg-foreground/5 font-medium text-foreground" : "border-dashed text-muted-foreground",
            )}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
