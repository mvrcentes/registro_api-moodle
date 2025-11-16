"use client"

import type { ColumnDef } from "@tanstack/react-table"
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
import type { ApplicationDetail } from "./types"
import { fullName, maskDPI, formatDateShort, cn } from "@/lib/utils"

function StatusBadge({ status }: { status: ApplicationDetail["status"] }) {
  const map: Record<
    ApplicationDetail["status"],
    { label: string; className: string }
  > = {
    pending: {
      label: "Pendiente",
      className: "bg-amber-500 text-white",
    },
    in_review: {
      label: "En revisión",
      className: "bg-sky-500 text-white",
    },
    approved: {
      label: "Aprobado",
      className: "bg-emerald-600 text-white",
    },
    rejected: {
      label: "Rechazado",
      className: "bg-red-600 text-white",
    },
  }

  const { label, className } = map[status]

  return (
    <Badge
      variant="outline"
      className={cn(
        "border-none px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        className
      )}>
      {label}
    </Badge>
  )
}

export const columns: ColumnDef<ApplicationDetail>[] = [
  {
    id: "fullName",
    header: "Nombre completo",
    accessorFn: (row) => fullName(row),
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
    cell: ({ row }) => <span className="tabular-nums">{row.original.dpi}</span>,
  },
  {
    accessorKey: "entidad",
    header: "Entidad",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <div className="truncate max-w-[260px]">{row.original.entidad}</div>
    ),
  },
  {
    accessorKey: "institucion",
    header: "Institución",
    filterFn: "equalsString",
    cell: ({ row }) => (
      <div className="truncate max-w-[260px]">{row.original.institucion}</div>
    ),
  },
  {
    accessorKey: "renglon",
    header: "Renglón",
    filterFn: "equalsString",
  },
  {
    accessorKey: "status",
    header: "Estado",
    filterFn: "equalsString",
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
