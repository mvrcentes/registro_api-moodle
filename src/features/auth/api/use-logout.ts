"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { LocalAuthApi } from "./auth.client"
import { parseAxiosError } from "@/lib/api-utils"

export function useLogout() {
  const router = useRouter()
  return async function logout() {
    try {
      await LocalAuthApi.logout()
      toast.success("Sesión cerrada")
    } catch (e: unknown) {
      const { message } = parseAxiosError(e)
      toast.error(message || "No se pudo cerrar sesión")
    } finally {
      router.replace("/auth/signin")
    }
  }
}
