"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

import { ApplicationRow } from "../types"
import {
  EtniaValue,
  DependenciaValue,
  ColegioValue,
} from "@/app/auth/signup/components/forms/types"

// --- Helpers de presentación ---
function Field({
  label,
  value,
  className,
}: {
  label: string
  value?: string | number | null
  className?: string
}) {
  return (
    <div className={className}>
      <Label className="mb-1 block text-xs">{label}</Label>
      <Input value={value ?? "—"} disabled readOnly />
    </div>
  )
}

function fullName(r: ApplicationRow) {
  return [r.primerNombre, r.segundoNombre, r.primerApellido, r.segundoApellido]
    .filter(Boolean)
    .join(" ")
}

function maskDPI(dpi: string) {
  // Enmascara todos menos los últimos 4
  return dpi.replace(/\d(?=\d{4})/g, "•")
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("es-GT", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function StatusBadge({ status }: { status: ApplicationRow["status"] }) {
  const map: Record<ApplicationRow["status"], { label: string }> = {
    pending: { label: "Pendiente" },
    in_review: { label: "En revisión" },
    approved: { label: "Aprobado" },
    rejected: { label: "Rechazado" },
  }
  return <Badge variant="secondary">{map[status].label}</Badge>
}

// --- Tipo de detalle para el Sheet (extiende la fila de la tabla) ---
export type ApplicationDetail = ApplicationRow & {
  etnia?: EtniaValue
  dependencia?: DependenciaValue
  colegio?: ColegioValue
  telefono?: string
  direccion?: string
}

// --- Componente principal ---
export function InformationSheet({
  trigger,
  data,
  title = "Ficha del solicitante",
  description = "Revisión completa de la información provista en el registro.",
}: {
  trigger: React.ReactNode
  data: ApplicationDetail
  title?: string
  description?: string
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>

      <SheetContent className="w-[92vw] max-w-[1600px] overflow-y-auto p-6">
        <SheetHeader className="p-0">
          <SheetTitle className="flex items-center gap-2">
            {title}
            <StatusBadge status={data.status} />
          </SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Identificación */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              Identificación
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <Field label="ID de solicitud" value={data.id} />
              <Field label="Nombre completo" value={fullName(data)} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Email" value={data.email} />
                <Field label="DPI" value={maskDPI(data.dpi)} />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Estado" value={data.status} />
                <Field
                  label="Fecha de solicitud"
                  value={formatDate(data.submittedAt)}
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* Afiliaciones / Laboral */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              Afiliaciones y vínculo laboral
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <Field label="Entidad" value={data.entidad} />
              <Field label="Institución" value={data.institucion} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Dependencia" value={data.dependencia} />
                <Field label="Renglón presupuestario" value={data.renglon} />
              </div>
              <Field label="Colegio profesional" value={data.colegio} />
            </div>
          </section>

          <Separator />

          {/* Demografía / Contacto (opcionales) */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              Demografía y contacto
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Etnia" value={data.etnia} />
              <Field label="Teléfono" value={data.telefono} />
            </div>
            <Field label="Dirección" value={data.direccion} />
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}
