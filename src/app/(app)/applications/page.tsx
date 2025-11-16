"use client"

import * as React from "react"
import { DataTable } from "./components/applications-table"
import { columns } from "./components/applications-columns"
import { useApplications } from "@/features/api/applications/useApplications"
import MetricCards from "./components/modal/MetricCards"
import { ApplicationDetail } from "./components/types"

export default function page() {
  const { data, loading, error, reload } = useApplications()

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Cargando solicitudes…</p>
    )
  }

  if (error) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-red-500">
          Error al cargar solicitudes: {error}
        </p>
        <button
          type="button"
          onClick={() => void reload()}
          className="text-sm underline">
          Reintentar
        </button>
      </div>
    )
  }

  const multipliedData: ApplicationDetail[] = data.flatMap((item) =>
    Array.from({ length: 100 }, () => item)
  )

  return (
    <div className="flex h-[calc(100vh-6rem)] w-full flex-col space-y-6">
      <h1 className="mb-6 text-2xl font-semibold">Solicitudes</h1>

      <MetricCards />

      {/* 👇 contenedor que le da altura y permite scroll interno a la tabla */}
      <div className="flex-1 min-h-0">
        <DataTable columns={columns} data={multipliedData} />
      </div>
    </div>
  )
}
