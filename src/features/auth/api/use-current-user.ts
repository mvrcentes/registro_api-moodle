"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { LocalAuthApi } from "./auth.client"
import { parseAxiosError } from "@/lib/api-utils"
import type { CurrentUser } from "./auth.dto"

const STORAGE_KEY = "current_user_v1"

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as CurrentUser) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState<boolean>(!user)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { user } = await LocalAuthApi.meAny()
      setUser(user as CurrentUser)
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } catch (e: unknown) {
      const { message } = parseAxiosError(e)
      setError(message)
      setUser(null)
      sessionStorage.removeItem(STORAGE_KEY)
    } finally {
      setLoading(false)
    }
  }, [])

  // Primer fetch si no hay cache
  useEffect(() => {
    if (!user) void fetchUser()
  }, [user, fetchUser])

  // Opcional: refrescar al volver a la pestaña
  useEffect(() => {
    const onFocus = () => void fetchUser()
    window.addEventListener("visibilitychange", onFocus)
    window.addEventListener("focus", onFocus)
    return () => {
      window.removeEventListener("visibilitychange", onFocus)
      window.removeEventListener("focus", onFocus)
    }
  }, [fetchUser])

  const isAdmin = useMemo(() => user?.role === "ADMIN", [user])

  return {
    user,
    isAdmin,
    loading,
    error,
    refresh: fetchUser,
    clear: () => {
      setUser(null)
      sessionStorage.removeItem(STORAGE_KEY)
    },
  }
}
