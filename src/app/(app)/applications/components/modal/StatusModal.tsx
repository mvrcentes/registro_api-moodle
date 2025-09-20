// src/app/(app)/applications/components/modal/StatusModal.tsx
"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

type Mode = "approve" | "reject" | "in_review"

type Props = {
  /** Botón o trigger externo que abre el diálogo */
  trigger: React.ReactNode
  /** Modo de la acción */
  mode: Mode
  /** Identificador de la solicitud (para mostrar y/o enviar al backend) */
  applicationId: string
  /** Nombre (para contexto visual) */
  applicantName?: string
  /** Callback que ejecuta la acción final (haz tu fetch aquí). Debe lanzar si falla. */
  onSubmit: (args: {
    id: string
    mode: Mode
    note?: string
  }) => Promise<void> | void
  /** Texto opcional que aparece como descripción superior */
  description?: string
}

const COPY: Record<
  Mode,
  {
    title: string
    step1: string
    step2: { ask: string; token: string; confirmCta: string }
    cta: string
    color: "default" | "destructive" | "secondary"
    needsNote: boolean
  }
> = {
  approve: {
    title: "Aprobar solicitud",
    step1:
      "Vas a aprobar esta solicitud. Asegúrate de haber verificado los datos y documentos necesarios.",
    step2: {
      ask: 'Para confirmar, escribe "APROBAR" en el campo de abajo.',
      token: "APROBAR",
      confirmCta: "Confirmar aprobación",
    },
    cta: "Aprobar",
    color: "default",
    needsNote: false,
  },
  in_review: {
    title: "Marcar como En revisión",
    step1:
      "Moverás la solicitud a estado 'En revisión'. Úsalo cuando está siendo evaluada por el equipo.",
    step2: {
      ask: 'Para confirmar, escribe "REVISAR" en el campo de abajo.',
      token: "REVISAR",
      confirmCta: "Confirmar cambio a En revisión",
    },
    cta: "En revisión",
    color: "secondary",
    needsNote: false,
  },
  reject: {
    title: "Rechazar solicitud",
    step1:
      "Vas a rechazar esta solicitud. Explica brevemente el motivo; el texto puede mostrarse al solicitante.",
    step2: {
      ask: 'Para confirmar, escribe "RECHAZAR" en el campo de abajo.',
      token: "RECHAZAR",
      confirmCta: "Confirmar rechazo",
    },
    cta: "Rechazar",
    color: "destructive",
    needsNote: true,
  },
}

export function StatusModal({
  trigger,
  mode,
  applicationId,
  applicantName,
  onSubmit,
  description,
}: Props) {
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState<1 | 2>(1)
  const [note, setNote] = React.useState("")
  const [token, setToken] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const cfg = COPY[mode]

  const reset = () => {
    setStep(1)
    setNote("")
    setToken("")
    setLoading(false)
  }

  const handleClose = (next: boolean) => {
    setOpen(next)
    if (!next) reset()
  }

  const canContinueStep1 = mode === "reject" ? note.trim().length >= 5 : true // pide mínimo contenido al rechazar

  const canConfirm =
    token.trim().toUpperCase() === cfg.step2.token.toUpperCase() &&
    (!cfg.needsNote || note.trim().length >= 5)

  const submit = async () => {
    try {
      setLoading(true)
      await onSubmit({
        id: applicationId,
        mode,
        note: note.trim() || undefined,
      })
      handleClose(false)
    } catch (e) {
      // aquí podrías disparar un toast de error
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent >
        <DialogHeader>
          <DialogTitle>{cfg.title}</DialogTitle>
          <DialogDescription>
            {description ??
              `Solicitud ${applicationId}${
                applicantName ? ` — ${applicantName}` : ""
              }`}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{cfg.step1}</p>

            {cfg.needsNote && (
              <div className="space-y-2">
                <label className="text-xs font-medium">
                  Motivo del rechazo
                </label>
                <Textarea
                  placeholder="Escribe el motivo…"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="min-h-[120px]"
                />
                <p className="text-[11px] text-muted-foreground">
                  Recomendación: sé concreto y profesional. Mín. 5 caracteres.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => handleClose(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setStep(2)} disabled={!canContinueStep1}>
                Continuar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{cfg.step2.ask}</p>
            <Input
              autoFocus
              placeholder={cfg.step2.token}
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            {cfg.needsNote && (
              <div className="space-y-1">
                <label className="text-xs font-medium">
                  Motivo del rechazo
                </label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            )}
            <div className="flex justify-between gap-2 pt-2">
              <Button variant="ghost" onClick={() => setStep(1)}>
                Volver
              </Button>
              <Button
                variant={cfg.color}
                onClick={submit}
                disabled={!canConfirm || loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {cfg.step2.confirmCta}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
