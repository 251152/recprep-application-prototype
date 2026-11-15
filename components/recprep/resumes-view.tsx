"use client"

import { useRef } from "react"
import { FilePlus, FileText, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResumeCard } from "./resume-card"
import type { BaseResume } from "@/lib/recprep/types"

type Props = {
  resumes: BaseResume[]
  onCreate: (title?: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  onTailor: () => void
}

export function ResumesView({ resumes, onCreate, onDuplicate, onDelete, onTailor }: Props) {
  const fileInput = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">Twoje CV bazowe</h1>
          <p className="mt-1 text-sm text-muted-foreground text-pretty">
            Zarządzaj głównymi wersjami CV, z których tworzysz dopasowane aplikacje.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInput}
            type="file"
            accept=".pdf,.doc,.docx"
            className="sr-only"
            tabIndex={-1}
            aria-hidden
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onCreate(file.name.replace(/\.[^.]+$/, ""))
              e.target.value = ""
            }}
          />
          <Button variant="outline" className="h-9" onClick={() => fileInput.current?.click()}>
            <Upload aria-hidden />
            Importuj CV
          </Button>
          <Button className="h-9" onClick={() => onCreate()}>
            <FilePlus aria-hidden />
            Utwórz CV
          </Button>
        </div>
      </div>

      {resumes.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center">
          <FileText className="size-6 text-muted-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground">Nie masz jeszcze żadnego CV bazowego.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {resumes.map((r) => (
            <ResumeCard
              key={r.id}
              resume={r}
              onDuplicate={() => onDuplicate(r.id)}
              onDelete={() => onDelete(r.id)}
              onTailor={onTailor}
            />
          ))}
        </div>
      )}
    </div>
  )
}
