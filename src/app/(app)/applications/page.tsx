"use client"

import { DataTable } from "./components/applications-table"
import { columns } from "./components/applications-columns"
import { useApplications } from "@/features/api/applications/useApplications"
import MetricCards from "./components/modal/MetricCards"

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

  return (
    <div className="w-full flex flex-col space-y-6">
      <h1 className="mb-6 text-2xl font-semibold">Solicitudes</h1>

      <MetricCards />

      <DataTable columns={columns} data={data} />
    </div>
  )
}
