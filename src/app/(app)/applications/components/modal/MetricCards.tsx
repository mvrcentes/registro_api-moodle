import React from "react"
import { ApplicationsApi } from "@/features/api/applications/applications.client"
import type { ApplicationStatus } from "@/app/(app)/applications/components/types"

interface MetricCardProps {
  title: string
  value: number | string
  icon?: React.ReactNode
}

interface ApplicationsMetrics {
  totalApplications: number
  applicationsByStatus: Record<ApplicationStatus, number>
}

const statusLabels: Record<ApplicationStatus, string> = {
  pending: "Pendientes",
  in_review: "En revisión",
  approved: "Aprobadas",
  rejected: "Rechazadas",
}

const MetricCard = ({ title, value, icon }: MetricCardProps) => {
  return (
    <div
      className="
        flex min-w-[220px] flex-1 flex-col
        rounded-xl border border-sidebar-ring/10
        bg-sidebar-ring/5
        px-5 py-4
        shadow-sm
      ">
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>{title}</span>
        {icon && <span className="text-sidebar-ring">{icon}</span>}
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  )
}

const MetricCards = () => {
  const [metrics, setMetrics] = React.useState<ApplicationsMetrics | null>(null)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await ApplicationsApi.metrics()
        setMetrics(data)
      } catch (err) {
        setError("No se pudieron cargar las métricas")
      } finally {
        setLoading(false)
      }
    }
    console.log("object");
    void fetchMetrics()
  }, [])

  if (loading) {
    return <p className="text-sm text-muted-foreground">Cargando métricas…</p>
  }

  if (error) {
    return (
      <p className="text-sm text-red-500">Error al cargar métricas: {error}</p>
    )
  }

  if (!metrics) {
    return null
  }

  const { totalApplications, applicationsByStatus } = metrics

  return (
    <div className="mb-6 flex flex-row flex-wrap gap-4">
      <MetricCard
        title="Solicitudes Pendientes"
        value={applicationsByStatus.pending}
      />
      <MetricCard
        title="Solicitudes Aprobadas"
        value={applicationsByStatus.approved}
      />
      <MetricCard
        title="Solicitudes Rechazadas"
        value={applicationsByStatus.rejected}
      />
    </div>
  )
}

export default MetricCards
