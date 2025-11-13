"use client"

import axios from "axios"
import { isAxiosError, parseAxiosError } from "@/lib/api-utils"
// #region Local API
import { apiLocal } from "@/services/axiosLocal"
import type { ApplicationDetail } from "@/app/(app)/applications/components/types"
import type { ApplicationsListResponseDTO } from "./applications.dto"

export const ApplicationsApi = {
  list: async (): Promise<ApplicationDetail[]> => {
    try {
      const res = await apiLocal.get<ApplicationsListResponseDTO>(
        "/applications"
      )

      // Validación defensiva por si el backend cambia algo raro
      if (!res.data?.ok || !Array.isArray(res.data.data)) {
        throw new Error("Unexpected applications response shape")
      }

      return res.data.data
    } catch (error: unknown) {
      // No filtramos detalles internos al UI, solo propagamos algo controlado
      const { status, message } = parseAxiosError(error)

      // Podrías mapear ciertos códigos a errores específicos (401 → no auth, etc.)
      throw new Error(
        `Error al obtener solicitudes (${status ?? "?"}): ${
          message || "Error inesperado"
        }`
      )
    }
  },
}
