import type { z } from "zod"
import type { SignupAllSchema, SigninSchema } from "@/features/auth/schemas/auth.schema"

// Tipos para los valores de los formularios
export type SigninFormValues = z.infer<typeof SigninSchema>
export type SignupFormValues = z.infer<typeof SignupAllSchema>

// Tipo para el usuario autenticado
export interface AuthUser {
  id: string
  email: string
  primerNombre: string
  primerApellido: string
  dpi: string
  role?: string
  token?: string
}

// Tipo para el estado de autenticación
export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
}