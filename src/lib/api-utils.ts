import type { ApiError } from "@/features/api/types"
import axios, { type AxiosError } from "axios"

export const isAxiosError = (e: unknown): e is AxiosError => axios.isAxiosError(e)

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v)

// Convierte cualquier error desconocido a ApiError tipado
export function parseAxiosError(e: unknown): ApiError {
  if (isAxiosError(e)) {
    const status = e.response?.status ?? 500
    const data = e.response?.data as unknown

    let message = e.message ?? "Error desconocido"
    let error: string | undefined

    if (isRecord(data)) {
      if (typeof data.message === "string") message = data.message
      if (typeof data.error === "string") error = data.error
      if (!error && typeof (data as Record<string, unknown>).name === "string") {
        error = String((data as Record<string, unknown>).name)
      }
    } else if (typeof data === "string" && data.trim()) {
      message = data
    }

    const details = isRecord(data) || Array.isArray(data) || typeof data === "string" ? data : e.toJSON?.() ?? null
    return { status, message, error, details }
  }
  if (e instanceof Error) {
    return { status: 500, message: e.message, details: e }
  }
  return { status: 500, message: "Error desconocido", details: e }
}
