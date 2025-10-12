"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LocalAuthApi } from "./auth.client"

export function useAuthGuard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<"ADMIN" | "APPLICANT" | null>(null)

  useEffect(() => {
    let alive = true
    LocalAuthApi.me()
      .then(({ user }) => {
        if (!alive) return
        setRole(user.role)
        setLoading(false)
      })
      .catch(() => {
        if (!alive) return
        setLoading(false)
        router.replace("/auth/signin")
      })
    return () => {
      alive = false
    }
  }, [router])

  return { loading, role }
}
