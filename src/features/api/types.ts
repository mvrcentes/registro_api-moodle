// Api Error

export interface ApiError {
  status: number
  message: string
  error?: string
}

export interface ApiResponse {
    success: boolean    
    error?: ApiError
}

