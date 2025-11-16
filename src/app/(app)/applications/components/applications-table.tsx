"use client"

import * as React from "react"
import type {
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import TableFilters from "./filter/TableFilters"
import {
  downloadCSV,
  fullName,
  formatDateShort,
  buildApplicationsCSV,
} from "@/lib/utils"
import type { ApplicationDetail } from "./types"

interface DataTableProps {
  columns: ColumnDef<ApplicationDetail>[]
  data: ApplicationDetail[]
}

export function DataTable({ columns, data }: DataTableProps) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState<string>("")

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      // solo estas visibles por defecto:
      fullName: true,
      dpi: true,
      email: true,
      status: true,
      submittedAt: true,
      actions: true,
      entidad: false,
      institucion: false,
      renglon: false,
    })

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters, globalFilter, columnVisibility },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString", // búsqueda simple
  })

  const handleExportCSV = () => {
    // Usamos las filas FILTRADAS, para respetar búsqueda/filtros
    const rows = table.getFilteredRowModel().rows
    //export todo sin filtro
    // const apps: ApplicationDetail[] = data
    const apps: ApplicationDetail[] = rows.map((row) => row.original)

    if (apps.length === 0) {
      // opcional: podrías mostrar un toast, por ahora simplemente no hace nada
      return
    }

    const csv = buildApplicationsCSV(apps)
    downloadCSV(csv, "solicitudes.csv")
  }

  return (
    <div className="flex h-full w-full flex-col space-y-4">
      <div className="flex items-center justify-between gap-2">
        <TableFilters table={table} />

        <div className="flex items-center gap-2">
          <Button
            className="bg-green-400"
            variant="outline"
            size="sm"
            onClick={handleExportCSV}>
            Exportar CSV
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Columnas <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllLeafColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }>
                    {column.columnDef.header &&
                    typeof column.columnDef.header === "string"
                      ? column.columnDef.header
                      : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="sticky top-0 z-10 bg-background">
                {hg.headers.map((header) => (
                  <TableHead key={header.id} className="bg-background">
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
