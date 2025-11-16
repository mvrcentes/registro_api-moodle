"use client"

import { parseAxiosError } from "@/lib/api-utils"
// #region Local API
import { apiLocal } from "@/services/axiosLocal"
import type {
  ApplicationDetail,
  ApplicationStatus,
} from "@/app/(app)/applications/components/types"
import type {
  ApplicationsListResponseDTO,
  ApplicationsMetricsResponseDTO,
} from "./applications.dto"

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

  updateStatus: async ({
    id,
    status,
    note,
  }: {
    id: string
    status: string
    note?: string
  }): Promise<void> => {
    try {
      await apiLocal.patch(`/applications/${id}/status`, {
        status,
        note,
      })
    } catch (error: unknown) {
      const { status: errorStatus, message } = parseAxiosError(error)
      throw new Error(
        `Error al actualizar estado (${errorStatus ?? "?"}): ${
          message || "Error inesperado"
        }`
      )
    }
  },
  metrics: async (): Promise<{
    totalApplications: number
    applicationsByStatus: Record<ApplicationStatus, number>
  }> => {
    try {
      const res = await apiLocal.get<ApplicationsMetricsResponseDTO>(
        "/applications/metrics"
      )

      if (!res.data?.ok || !res.data.data) {
        throw new Error("Unexpected applications metrics response shape")
      }

      return res.data.data
    } catch (error: unknown) {
      const { status, message } = parseAxiosError(error)

      throw new Error(
        `Error al obtener métricas (${status ?? "?"}): ${
          message || "Error inesperado"
        }`
      )
    }
  },
}
