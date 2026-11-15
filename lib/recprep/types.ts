export type ApplicationStatus = "saved" | "applied" | "interview" | "offer" | "rejected"
export type WorkMode = "remote" | "hybrid" | "onsite"
export type EmploymentType = "B2B" | "UoP" | "Kontrakt"

export type LinkedCv = {
  id: string
  name: string
}

export type JobOffer = {
  id: string
  title: string
  company: string
  language: "PL" | "EN"
  status: ApplicationStatus
  favorite: boolean
  salary: string | null
  workMode: WorkMode | null
  employment: EmploymentType | null
  location: string | null
  interviewAt: string | null
  interviewStage: string | null
  recruiterContact: string
  notes: string
  description: string
  url: string | null
  linkedCvs: LinkedCv[]
  requirements: { required: string[]; niceToHave: string[] }
  appliedAt: string | null
  createdAt: string
  updatedAt: string
}

export type BaseResume = {
  id: string
  title: string
  targetRole: string
  summary: string
  editedAt: string
}

export type PipelineFilter = "all" | "saved" | "applied" | "interview" | "offer" | "favorite" | "noCv"
export type SortKey = "updated" | "interview" | "company" | "title"
export type ViewMode = "grid" | "list"
export type AppTab = "offers" | "resumes"
