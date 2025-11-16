"use client"

import { apiLocal } from "@/services/axiosLocal"
import type { UserOverview } from "@/app/(app)/settings/users/components/users.types"
import type { UsersCreateResponseDTO, UsersListResponseDTO } from "./users.dto"
import { parseAxiosError } from "@/lib/api-utils"

export const UsersApi = {
  list: async (): Promise<UserOverview[]> => {
    try {
      const res = await apiLocal.get<UsersListResponseDTO>("/users")

      if (res.status !== 200) {
        throw new Error("Unexpected users response shape")
      }

      return res.data.data
    } catch (error: unknown) {
      const { status, message } = parseAxiosError(error)

      throw new Error(
        `Error al obtener usuarios (${status ?? "?"}): ${
          message || "Error inesperado"
        }`
      )
    }
  },

  createAdminUser: async (payload: {
    firstName: string
    lastName: string
    email: string
    password: string
    role: UserOverview["role"]
  }): Promise<UserOverview> => {
    try {
      const res = await apiLocal.post<UsersCreateResponseDTO>("/users", payload)

      if (res.status !== 201 || !res.data.ok) {
        throw new Error("Respuesta inesperada al crear usuario administrativo")
      }

      return res.data.data
    } catch (error: unknown) {
      const { status, message } = parseAxiosError(error)

      throw new Error(
        `Error al crear usuario administrativo (${status ?? "?"}): ${
          message || "Error inesperado"
        }`
      )
    }
  },
}
