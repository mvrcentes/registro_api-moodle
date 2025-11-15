import type { UserRole } from "@/features/auth/api/auth.dto"

export interface UserOverview {
    nombre: string
    email: string
    role: UserRole
}

