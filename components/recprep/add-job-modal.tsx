"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export type NewJobInput = { title: string; company: string; description: string; url: string | null }

export function AddJobModal({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: NewJobInput) => void
}) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const url = String(data.get("url") ?? "").trim()
    onSubmit({
      title: String(data.get("title") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      description: String(data.get("description") ?? "").trim(),
      url: url || null,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Dodaj nową ofertę</DialogTitle>
            <DialogDescription>Wklej treść ogłoszenia — wymagania i warunki uzupełnisz później w szczegółach.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-title">Stanowisko</Label>
              <Input id="new-title" name="title" required placeholder="np. Senior Frontend Developer" autoFocus />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-company">Firma</Label>
              <Input id="new-company" name="company" required placeholder="np. Allegro" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-description">Treść ogłoszenia</Label>
            <Textarea
              id="new-description"
              name="description"
              required
              rows={6}
              placeholder="Wklej pełną treść ogłoszenia…"
              className="max-h-64"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-url">
              Link do ogłoszenia <span className="font-normal text-muted-foreground">(opcjonalnie)</span>
            </Label>
            <Input id="new-url" name="url" type="url" placeholder="https://justjoin.it/…" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Anuluj
            </Button>
            <Button type="submit">Dodaj ofertę</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
