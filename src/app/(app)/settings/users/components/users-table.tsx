"use client"

import * as React from "react"
import type { ColumnDef, ColumnFiltersState } from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { UserOverview } from "./users.types"
import SearchFilter from "@/components/reusable/filters/SearchFilter"
import { createAccentInsensitiveGlobalFilter } from "@/lib/utils"
import { CreateAdminUserSheet } from "./modal/CreateAdminUserSheet"
import { Button } from "@/components/ui/button"
import { UserRole } from "@/features/auth/api/auth.dto"

interface DataTableProps {
  columns: ColumnDef<UserOverview>[]
  data: UserOverview[]
  admin?: boolean
  onReload?: () => void
}

export function UsersTable({
  columns,
  data,
  admin = false,
  onReload,
}: DataTableProps) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState<string>("")

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters, globalFilter },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: createAccentInsensitiveGlobalFilter<UserOverview>(),
  })

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-row gap-2">
        <SearchFilter
          value={globalFilter}
          onChange={setGlobalFilter}
          placeholder="Buscar usuarios..."
        />

        {admin && (
          <CreateAdminUserSheet
            title="Creación de un nuevo usuario administrativo"
            description="Rellena el formulario para crear un nuevo usuario con privilegios administrativos."
            trigger={<Button variant="default">Crear Usuario</Button>}
            data={{
              firstName: "",
              lastName: "",
              email: "",
              role: UserRole.ADMIN,
            }}
            onSuccess={onReload}
          />
        )}
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
