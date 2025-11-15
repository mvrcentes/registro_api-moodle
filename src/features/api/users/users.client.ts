"use client"

import { apiLocal } from "@/services/axiosLocal"
import type { UserOverview } from "@/app/(app)/settings/users/components/users.types"
import type { UsersListResponseDTO } from "./users.dto"
import { parseAxiosError } from "@/lib/api-utils"

export const UsersApi = {
  list: async (): Promise<UserOverview[]> => {
    try {
      const res = await apiLocal.get<UsersListResponseDTO>("/users")

      if (res.status !== 200) {
        throw new Error("Unexpected users response shape")
      }

      return res.data.users
    } catch (error: unknown) {
      const { status, message } = parseAxiosError(error)

      throw new Error(
        `Error al obtener usuarios (${status ?? "?"}): ${
          message || "Error inesperado"
        }`
      )
    }
  },
}
