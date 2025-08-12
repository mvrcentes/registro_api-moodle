// Api Error and Response Types

export interface ApiError {
  status: number
  message: string
  error?: string
}

export interface ApiResponse {
  success: boolean    
  error?: ApiError
}

// User Types
export interface User {
  id: string
  email: string
  primerNombre: string
  primerApellido: string
  dpi: string
  role?: string
  created_at?: string
}

export interface UserData {
  dpi: string
  primerNombre: string
  segundoNombre?: string
  primerApellido: string
  segundoApellido?: string
  email: string
  fechaNacimiento?: string
  sexo?: string
  pais?: string
  departamento?: string
  municipio?: string
  nit?: string
  telefono?: string
  entidad?: string
  dependencia?: string
  renglon?: string
  colegio?: string
  numeroColegiado?: string
  message?: string
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
  data?: any
}

