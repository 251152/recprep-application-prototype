"use client"

import { useState } from "react"
import { OffersView } from "./offers-view"
import { ResumesView } from "./resumes-view"
import { TopNav } from "./top-nav"
import type { NewJobInput } from "./add-job-modal"
import { TODAY, nowStamp } from "@/lib/recprep/format"
import { initialOffers, initialResumes } from "@/lib/recprep/mock-data"
import type { AppTab, BaseResume, JobOffer, PipelineFilter } from "@/lib/recprep/types"

export function AppShell() {
  const [tab, setTab] = useState<AppTab>("offers")
  const [offers, setOffers] = useState<JobOffer[]>(initialOffers)
  const [resumes, setResumes] = useState<BaseResume[]>(initialResumes)
  const [pipeline, setPipeline] = useState<PipelineFilter>("all")

  function updateOffer(id: string, patch: Partial<JobOffer>) {
    setOffers((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o
        const next = { ...o, ...patch, updatedAt: nowStamp() }
        if (patch.status && patch.status !== "saved" && !o.appliedAt) next.appliedAt = TODAY
        return next
      }),
    )
  }

  function addOffer(input: NewJobInput) {
    const stamp = nowStamp()
    setOffers((prev) => [
      {
        id: `job-${Date.now()}`,
        title: input.title,
        company: input.company,
        language: "PL",
        status: "saved",
        favorite: false,
        salary: null,
        workMode: null,
        employment: null,
        location: null,
        interviewAt: null,
        interviewStage: null,
        recruiterContact: "",
        notes: "",
        description: input.description,
        url: input.url,
        linkedCvs: [],
        requirements: { required: [], niceToHave: [] },
        appliedAt: null,
        createdAt: TODAY,
        updatedAt: stamp,
      },
      ...prev,
    ])
    setPipeline("all")
  }

  function createResume(title?: string) {
    setResumes((prev) => [
      ...prev,
      {
        id: `cv-${Date.now()}`,
        title: title || "Nowe CV",
        targetRole: "Uzupełnij docelowe stanowisko",
        summary: "To CV jest jeszcze puste. Dodaj podsumowanie zawodowe, doświadczenie i kluczowe umiejętności.",
        editedAt: TODAY,
      },
    ])
  }

  function duplicateResume(id: string) {
    setResumes((prev) => {
      const source = prev.find((r) => r.id === id)
      if (!source) return prev
      const copy = { ...source, id: `cv-${Date.now()}`, title: `${source.title} (kopia)`, editedAt: TODAY }
      const index = prev.findIndex((r) => r.id === id)
      return [...prev.slice(0, index + 1), copy, ...prev.slice(index + 1)]
    })
  }

  return (
    <div className="flex min-h-svh w-full flex-col">
      <TopNav tab={tab} onTabChange={setTab} />
      <main className="w-full flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {tab === "offers" ? (
          <OffersView
            offers={offers}
            resumes={resumes}
            pipeline={pipeline}
            onPipelineChange={setPipeline}
            onUpdate={updateOffer}
            onDelete={(id) => setOffers((prev) => prev.filter((o) => o.id !== id))}
            onAdd={addOffer}
          />
        ) : (
          <ResumesView
            resumes={resumes}
            onCreate={createResume}
            onDuplicate={duplicateResume}
            onDelete={(id) => setResumes((prev) => prev.filter((r) => r.id !== id))}
            onTailor={() => {
              setPipeline("noCv")
              setTab("offers")
            }}
          />
        )}
      </main>
    </div>
  )
}
