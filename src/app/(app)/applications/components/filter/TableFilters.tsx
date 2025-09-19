"use client"

import * as React from "react"
import type { Table } from "@tanstack/react-table"
import SearchFilter from "@/components/reusable/filters/SearchFilter"
import {
  FilterSelect,
  SelectOption,
} from "@/components/reusable/filters/FilterSelect"
import { ApplicationRow } from "../types"
import {
  ENTIDAD_OPTIONS,
  INSTITUCION_OPTIONS,
  RENGLON_OPTIONS,
} from "@/app/auth/signup/components/forms/types"

const STATUS_OPTIONS: SelectOption<ApplicationRow["status"]>[] = [
  { value: "pending", label: "Pendientes" },
  { value: "in_review", label: "En revisión" },
  { value: "approved", label: "Aprobadas" },
  { value: "rejected", label: "Rechazadas" },
]

export default function TableFilters({
  table,
}: {
  table: Table<ApplicationRow>
}) {
  const global = (table.getState() as any).globalFilter as string | undefined

  const setCol = (col: keyof ApplicationRow, val?: string) =>
    table.getColumn(col as string)?.setFilterValue(val ?? undefined)

  const getColVal = (col: keyof ApplicationRow) =>
    (table.getColumn(col as string)?.getFilterValue() as string | undefined) ??
    undefined

  return (
    <div className="flex flex-wrap items-center gap-2 min-w-0">
      <SearchFilter
        value={global ?? ""}
        onChange={(v) => table.setGlobalFilter(v)}
        placeholder="Buscar "
      />

      <FilterSelect
        value={getColVal("status") as ApplicationRow["status"] | undefined}
        onChange={(v) => setCol("status", v)}
        options={STATUS_OPTIONS}
        placeholder="Estado"
        className="w-[140px]"
      />

      <FilterSelect
        value={getColVal("entidad")}
        onChange={(v) => setCol("entidad", v)}
        options={ENTIDAD_OPTIONS}
        placeholder="Entidad"
      />

      <FilterSelect
        value={getColVal("institucion")}
        onChange={(v) => setCol("institucion", v)}
        options={INSTITUCION_OPTIONS}
        placeholder="Institución"
      />

      <FilterSelect
        value={getColVal("renglon")}
        onChange={(v) => setCol("renglon", v)}
        options={RENGLON_OPTIONS}
        placeholder="Renglón"
      />
    </div>
  )
}
