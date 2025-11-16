"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { UserOverview } from "./users.types"
import { UserOverviewSheet } from "./modal/UserOverviewSheet"

export const columns: ColumnDef<UserOverview>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.firstName}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "apellido",
    header: "Apellido",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.lastName}</div>
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
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <UserOverviewSheet
          trigger={
            <Button variant="ghost" size="icon">
              <Eye />
            </Button>
          }
          data={row.original}
          title={`Información de ${row.original.firstName}`}
          description="Detalles del usuario seleccionado"
        />
      </div>
    ),
  },
]
