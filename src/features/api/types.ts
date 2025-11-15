// Api Error and Response Types
import type { User, UserData } from "@/features/auth/api/auth.dto"

export interface ApiError {
  status: number
  message: string
  error?: string
  details?: unknown
}

export interface ApiResponse {
  success: boolean
  error?: ApiError
}

// Authentication Response Types
export interface ISigninResponseDTO extends ApiResponse {
  data?: {
    user: User
    token: string
    message: string
  }
}

export interface ISignupPreFillResponseDTO extends ApiResponse {
  data?: UserData
}

export interface ISignupCompleteResponseDTO extends ApiResponse {
  data?: {
    userId: string
    message: string
    status?: string
  }
}

// User Management Response Types
export interface IUserListResponseDTO extends ApiResponse {
  data?: {
    users: User[]
    total: number
    page: number
    limit: number
  }
}

export interface IUserDetailResponseDTO extends ApiResponse {
  data?: Record<string, unknown>
}
