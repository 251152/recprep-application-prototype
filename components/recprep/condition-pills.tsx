import { Banknote, BriefcaseBusiness, Building2, House, Laptop, MapPin, type LucideIcon } from "lucide-react"
import { WORK_MODE_LABEL } from "@/lib/recprep/format"
import type { JobOffer, WorkMode } from "@/lib/recprep/types"
import { cn } from "@/lib/utils"

const WORK_MODE_ICON: Record<WorkMode, LucideIcon> = {
  remote: Laptop,
  hybrid: House,
  onsite: Building2,
}

function Pill({
  icon: Icon,
  children,
  emphasized,
  className,
}: {
  icon: LucideIcon
  children: React.ReactNode
  emphasized?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1 rounded-md border px-1.5 text-xs whitespace-nowrap",
        emphasized ? "bg-muted/60 font-medium text-foreground" : "bg-background text-muted-foreground",
        className,
      )}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden />
      {children}
    </span>
  )
}

type HideMap = Partial<Record<"salary" | "workMode" | "employment" | "location", string>>

export function ConditionPills({ offer, hide, className }: { offer: JobOffer; hide?: HideMap; className?: string }) {
  const hasAny = offer.salary || offer.workMode || offer.employment || offer.location
  if (!hasAny) return null

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {offer.salary && (
        <Pill icon={Banknote} emphasized className={hide?.salary}>
          <span className="sr-only">Stawka: </span>
          {offer.salary}
        </Pill>
      )}
      {offer.workMode && (
        <Pill icon={WORK_MODE_ICON[offer.workMode]} className={hide?.workMode}>
          {WORK_MODE_LABEL[offer.workMode]}
        </Pill>
      )}
      {offer.employment && (
        <Pill icon={BriefcaseBusiness} className={hide?.employment}>
          {offer.employment}
        </Pill>
      )}
      {offer.location && (
        <Pill icon={MapPin} className={hide?.location}>
          {offer.location}
        </Pill>
      )}
    </div>
  )
}
