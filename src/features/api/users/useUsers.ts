"use client"

import { useCallback, useEffect, useState } from "react"
import type { UserOverview } from "@/app/(app)/settings/users/components/users.types"
import { UsersApi } from "./users.client"

type UseUsersResult = {
  data: UserOverview[]
  loading: boolean
  error: string | null
  reload: () => Promise<void>
}

export function useUsers(): UseUsersResult {
  const [data, setData] = useState<UserOverview[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const users = await UsersApi.list()
      setData(users)
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Error al cargar usuarios"
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
