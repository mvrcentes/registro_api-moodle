"use client"

import api from "@/services/axiosInstance"
import { ISigninResponseDTO } from "./auth.dto"
import { SigninSchema } from "@/features/auth/schemas/auth.schema"
import { z } from "zod"

export const signin = async (
  data: z.infer<typeof SigninSchema>
): Promise<ISigninResponseDTO> => {
  try {
    const response = await api.post<ISigninResponseDTO>("/auth/signin", data)

    if (response.data.success === true) {
      return {
        success: true,
        data: response.data.data,
      }
    }

    return {
      success: false,
      error: {
        status: response.status,
        message: response.data?.error?.message || "Credenciales inválidas",
        error: response.data?.error?.error || "Unauthorized",
      },
    }
  } catch (error: any) {
    return {
      success: false,
      error: {
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Error al iniciar sesión",
        error: error.response?.data?.error || "Internal Server Error",
      },
    }
  }
}
