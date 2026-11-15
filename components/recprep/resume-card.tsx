"use client"

import { Copy, Ellipsis, Target, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatFullDate } from "@/lib/recprep/format"
import type { BaseResume } from "@/lib/recprep/types"

type Props = {
  resume: BaseResume
  onDuplicate: () => void
  onDelete: () => void
  onTailor: () => void
}

export function ResumeCard({ resume, onDuplicate, onDelete, onTailor }: Props) {
  return (
    <article className="group flex flex-col rounded-xl border bg-card text-card-foreground transition-colors hover:border-foreground/20">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <header className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] leading-snug font-semibold">{resume.title}</h3>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">{resume.targetRole}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon-sm" className="-mt-1 -mr-1 text-muted-foreground" />}
              aria-label={`Opcje dla ${resume.title}`}
            >
              <Ellipsis aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy aria-hidden />
                Duplikuj
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={onDelete}>
                <Trash2 aria-hidden />
                Usuń
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <div className="rounded-lg border bg-muted/40 p-3">
          <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">{resume.summary}</p>
        </div>
      </div>

      <footer className="relative h-12 border-t px-4">
        <p className="flex h-full items-center text-xs text-muted-foreground transition-opacity duration-200 group-focus-within:opacity-0 group-hover:opacity-0 pointer-coarse:opacity-0">
          Edytowano {formatFullDate(resume.editedAt)}
        </p>
        <div className="absolute inset-0 flex items-center px-2 opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100">
          <Button size="sm" className="w-full" onClick={onTailor}>
            <Target aria-hidden />
            Dopasuj ATS
          </Button>
        </div>
      </footer>
    </article>
  )
}
