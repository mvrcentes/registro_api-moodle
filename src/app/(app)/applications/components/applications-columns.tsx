"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { InformationSheet } from "./modal/InformationSheet"
import { ApplicationRow } from "./types"
import { fullName, maskDPI, formatDateShort } from "@/lib/utils"

function StatusBadge({ status }: { status: ApplicationRow["status"] }) {
  const map: Record<ApplicationRow["status"], { label: string }> = {
    pending: { label: "Pendiente" },
    in_review: { label: "En revisión" },
    approved: { label: "Aprobado" },
    rejected: { label: "Rechazado" },
  }
  return <Badge variant="secondary">{map[status].label}</Badge>
}

export const columns: ColumnDef<ApplicationRow>[] = [
  {
    accessorKey: "primerNombre",
    header: "Nombre",
    cell: ({ row }) => (
      <div className="font-medium">{fullName(row.original)}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="truncate max-w-[220px]">{row.original.email}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "dpi",
    header: "DPI",
    cell: ({ row }) => (
      <span className="tabular-nums">{maskDPI(row.original.dpi)}</span>
    ),
  },
  {
    accessorKey: "entidad",
    header: "Entidad",
    cell: ({ row }) => (
      <div className="truncate max-w-[260px]">{row.original.entidad}</div>
    ),
  },
  {
    accessorKey: "institucion",
    header: "Institución",
    cell: ({ row }) => (
      <div className="truncate max-w-[260px]">{row.original.institucion}</div>
    ),
  },
  {
    accessorKey: "renglon",
    header: "Renglón",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "submittedAt",
    header: () => <div className="text-right">Fecha</div>,
    cell: ({ row }) => (
      <div className="text-right">
        {formatDateShort(row.original.submittedAt)}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <InformationSheet
        data={row.original}
        trigger={
          <Button variant="ghost" size="icon" aria-label="Ver detalle">
            <Eye className="h-4 w-4" />
          </Button>
        }
      />
    ),
    enableHiding: false,
    size: 48, // opcional
  },
]
