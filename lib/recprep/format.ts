import type { ApplicationStatus, EmploymentType, JobOffer, WorkMode } from "./types"

export const TODAY = "2026-11-14"

export const STATUS_META: Record<ApplicationStatus, { label: string; dot: string }> = {
  saved: { label: "Zapisana", dot: "bg-muted-foreground/60" },
  applied: { label: "Wysłane CV", dot: "bg-sky-500" },
  interview: { label: "Rozmowa", dot: "bg-amber-500" },
  offer: { label: "Oferta", dot: "bg-emerald-500" },
  rejected: { label: "Odrzucona", dot: "bg-red-500" },
}

export const STATUS_ORDER: ApplicationStatus[] = ["saved", "applied", "interview", "offer", "rejected"]

export const WORK_MODE_LABEL: Record<WorkMode, string> = {
  remote: "Zdalnie",
  hybrid: "Hybrydowo",
  onsite: "Stacjonarnie",
}

export const EMPLOYMENT_OPTIONS: EmploymentType[] = ["B2B", "UoP", "Kontrakt"]

function toUtcDay(date: string) {
  const [y, m, d] = date.slice(0, 10).split("-").map(Number)
  return Date.UTC(y, m - 1, d)
}

export function formatShortDate(date: string) {
  const [, m, d] = date.slice(0, 10).split("-")
  return `${d}.${m}`
}

export function formatFullDate(date: string) {
  const [y, m, d] = date.slice(0, 10).split("-")
  return `${d}.${m}.${y}`
}

export function formatInterview(iso: string) {
  const time = iso.slice(11, 16)
  return time ? `${formatShortDate(iso)}, ${time}` : formatShortDate(iso)
}

export function relativeDays(date: string) {
  const diff = Math.round((toUtcDay(TODAY) - toUtcDay(date)) / 86_400_000)
  if (diff <= 0) return "dzisiaj"
  if (diff === 1) return "wczoraj"
  return `${diff} dni temu`
}

export function contextDate(offer: JobOffer) {
  if (offer.appliedAt && offer.status !== "saved") return `Wysłano ${relativeDays(offer.appliedAt)}`
  return `Dodano ${formatShortDate(offer.createdAt)}`
}

export function nowStamp() {
  return `${TODAY}T${new Date().toTimeString().slice(0, 5)}`
}
