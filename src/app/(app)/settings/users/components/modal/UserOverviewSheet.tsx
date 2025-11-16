"use client"

import type { ReactNode } from "react"
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
import type { UserOverview } from "../users.types"

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

export function UserOverviewSheet({
  trigger,
  data,
  title = "Información del usuario",
  description = "Detalles del usuario seleccionado",
  children,
}: {
  trigger: ReactNode
  data: UserOverview
  title?: string
  description?: string
  children?: ReactNode
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="overflow-y-auto p-4">
        <SheetHeader className="p-0">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-3">
            <Field label="Nombre" value={data.firstName} />
            <Field label="Apellido" value={data.lastName} />
          </div>
          <Field label="Email" value={data.email} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
