"use client"

import { useCallback, useEffect, useState } from "react"
import type { ApplicationDetail } from "@/app/(app)/applications/components/types"
import { ApplicationsApi } from "./applications.client"

type UseApplicationsResult = {
  data: ApplicationDetail[]
  loading: boolean
  error: string | null
  reload: () => Promise<void>
}

export function useApplications(): UseApplicationsResult {
  const [data, setData] = useState<ApplicationDetail[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const apps = await ApplicationsApi.list()
      setData(apps)
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Error al cargar solicitudes"
      setError(message)
      setData([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    reload: fetchData,
  }
}
