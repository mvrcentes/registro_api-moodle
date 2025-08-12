import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export interface ApiError {
  status: number
  message: string
  error?: string
  details?: any
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiError
}

export class ApiErrorHandler {
  static handleError(error: unknown): NextResponse<ApiResponse> {
    console.error('API Error:', error)

    // Error de validación de Zod
    if (error instanceof ZodError) {
      const response: ApiResponse = {
        success: false,
        error: {
          status: 400,
          message: 'Datos de entrada inválidos',
          error: 'Validation Error',
          details: error.issues
        }
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Error de Axios (API externa)
    if (this.isAxiosError(error)) {
      const response: ApiResponse = {
        success: false,
        error: {
          status: error.response?.status || 500,
          message: error.response?.data?.message || error.message || 'Error en API externa',
          error: 'External API Error',
          details: error.response?.data
        }
      }
      return NextResponse.json(response, { 
        status: error.response?.status || 500 
      })
    }

    // Error genérico
    const response: ApiResponse = {
      success: false,
      error: {
        status: 500,
        message: 'Error interno del servidor',
        error: 'Internal Server Error'
      }
    }
    return NextResponse.json(response, { status: 500 })
  }

  static createSuccessResponse<T>(
    data: T, 
    status: number = 200
  ): NextResponse<ApiResponse<T>> {
    const response: ApiResponse<T> = {
      success: true,
      data
    }
    return NextResponse.json(response, { status })
  }

  static createErrorResponse(
    message: string,
    status: number = 400,
    error: string = 'Bad Request',
    details?: any
  ): NextResponse<ApiResponse> {
    const response: ApiResponse = {
      success: false,
      error: {
        status,
        message,
        error,
        details
      }
    }
    return NextResponse.json(response, { status })
  }

  private static isAxiosError(error: any): error is any {
    return error.isAxiosError === true
  }
}

// Wrapper para manejar errores de manera consistente
export function withErrorHandler<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      return ApiErrorHandler.handleError(error)
    }
  }
}

// Utilidades para validación
export class ValidationUtils {
  static validateRequiredFields(
    data: Record<string, any>, 
    requiredFields: string[]
  ): { isValid: boolean; missingFields: string[] } {
    const missingFields = requiredFields.filter(field => !data[field])
    return {
      isValid: missingFields.length === 0,
      missingFields
    }
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static validateCUI(cui: string): boolean {
    return /^\d{13}$/.test(cui)
  }

  static validateNIT(nit: string): boolean {
    return /^\d{8,9}$/.test(nit)
  }

  static validatePhoneNumber(phone: string): boolean {
    return /^\d{4}-\d{4}$/.test(phone)
  }
}

// Utilidades para logging
export class LoggingUtils {
  static logApiCall(method: string, endpoint: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API ${method}] ${endpoint}`, data ? { data } : '')
    }
  }

  static logError(context: string, error: any, additionalInfo?: any) {
    console.error(`[ERROR ${context}]`, {
      error: error.message || error,
      stack: error.stack,
      ...additionalInfo
    })
  }

  static logSuccess(context: string, message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[SUCCESS ${context}] ${message}`, data || '')
    }
  }
}
