import type { UserRole } from "@/features/auth/api/auth.dto"

export interface UserOverview {
    firstName: string
    lastName: string
    email: string
    role: UserRole
}

