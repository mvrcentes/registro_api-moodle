"use client"

import axios from "axios"
import {
  ISigninResponseDTO,
  ISignupPreFillResponseDTO,
  ISignupCompleteResponseDTO,
  IUserListResponseDTO,
  IUserDetailResponseDTO,
} from "./auth.dto"
import {
  SigninSchema,
  SignupPreFillSchema,
  SignupAllSchema,
} from "@/features/auth/schemas/auth.schema"
import { z } from "zod"

// Configuración de la API externa
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  credentials: {
    username: process.env.NEXT_PUBLIC_BASE_API_USER || "APIMOODLE",
    password: process.env.NEXT_PUBLIC_BASE_API_PASSWORD || "usr$API#MOODL3",
  },
}

// Cliente Axios configurado para la API externa
const externalApi = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
})

// Variable para almacenar el token y su tiempo de expiración
let authToken: string | null = null
let tokenExpiry: number | null = null

// Función para limpiar el token almacenado
const clearStoredToken = () => {
  authToken = null
  tokenExpiry = null
}

// Función para verificar si el token está válido
const isTokenValid = (): boolean => {
  if (!authToken) return false
  if (!tokenExpiry) return true // Si no hay tiempo de expiración, asumir válido
  return Date.now() < tokenExpiry
}

// Función para obtener el token de autenticación
const getAuthToken = async (): Promise<string> => {
  // Si ya tenemos un token válido, lo devolvemos
  if (isTokenValid()) {
    return authToken as string
  }

  try {
    const response = await externalApi.post("/login", {
      usuario: API_CONFIG.credentials.username,
      clave: API_CONFIG.credentials.password,
    })

    let extractedToken = null

    // Intentar extraer el token de varios campos posibles
    if (response.data && response.data.token) {
      extractedToken = response.data.token

      // Si el token es un objeto con un campo 'value', extraer ese valor
      if (typeof extractedToken === "object" && extractedToken.value) {
        extractedToken = extractedToken.value
      }
    } else if (
      response.data &&
      response.data.data &&
      response.data.data.token
    ) {
      extractedToken = response.data.data.token

      if (typeof extractedToken === "object" && extractedToken.value) {
        extractedToken = extractedToken.value
      }
    } else if (response.data && response.data.accessToken) {
      extractedToken = response.data.accessToken
    } else if (response.data && response.data.access_token) {
      extractedToken = response.data.access_token
    } else if (response.data && typeof response.data === "string") {
      extractedToken = response.data
    }

    if (extractedToken) {
      // Asegurar que es string y almacenarlo
      authToken = String(extractedToken)
      // Establecer expiración en 1 hora por defecto
      tokenExpiry = Date.now() + 60 * 60 * 1000

      return authToken
    }

    throw new Error("No token received from login")
  } catch (error: any) {
    console.error("Error getting auth token:", error)

    // Limpiar token en caso de error
    clearStoredToken()

    // Para error 409, podría ser que ya hay una sesión activa
    if (error.response?.status === 409) {
      // Si el error incluye un token, lo usamos
      if (error.response?.data?.token) {
        authToken = String(error.response.data.token)
        tokenExpiry = Date.now() + 60 * 60 * 1000
        return authToken
      }
    }

    throw error
  }
}

export const signin = async (
  data: z.infer<typeof SigninSchema>
): Promise<ISigninResponseDTO> => {
  try {
    // Para el signin del usuario final, obtenemos el token de autenticación del sistema
    const token = await getAuthToken()

    // Verificamos que el usuario exista
    const userResponse = await externalApi.get(`/usuarios/${data.dpi}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (userResponse.data) {
      const userData = userResponse.data

      return {
        success: true,
        data: {
          user: {
            id: userData.dpi || data.dpi,
            email: userData.email || "",
            primerNombre: userData.primerNombre || "",
            primerApellido: userData.primerApellido || "",
            dpi: data.dpi,
            role: "user",
          },
          token: token,
          message: "Inicio de sesión exitoso",
        },
      }
    }

    return {
      success: false,
      error: {
        status: 401,
        message: "Usuario no encontrado",
        error: "User Not Found",
      },
    }
  } catch (error: any) {
    console.error("Signin error:", error)

    return {
      success: false,
      error: {
        status: error.response?.status || 500,
        message:
          error.response?.data?.message ||
          error.message ||
          "Error al iniciar sesión",
        error: "API Error",
      },
    }
  }
}

export const prefill = async (
  data: z.infer<typeof SignupPreFillSchema>
): Promise<ISignupPreFillResponseDTO> => {
  try {
    // Obtener el token de autenticación
    const token = await getAuthToken()

    // Consultar los datos del usuario usando el DPI
    const response = await externalApi.get(`/usuarios/${data.dpi}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.data && response.data.list && response.data.list.length > 0) {
      // Los datos están en response.data.list[0]
      const userData = response.data.list[0]

      // Mapear el país correctamente
      let paisValue = userData.pais || userData.country || "Guatemala"
      if (paisValue === "GUATEMALA") {
        paisValue = "Guatemala"
      }

      const result = {
        success: true,
        data: {
          dpi: userData.dpi || data.dpi,
          primerNombre:
            userData.primerNombre ||
            userData.primer_nombre ||
            userData.firstName ||
            "",
          segundoNombre:
            userData.segundoNombre ||
            userData.segundo_nombre ||
            userData.secondName ||
            "",
          primerApellido:
            userData.primerApellido ||
            userData.primer_apellido ||
            userData.lastName ||
            "",
          segundoApellido:
            userData.segundoApellido ||
            userData.segundo_apellido ||
            userData.secondLastName ||
            "",
          email: userData.email || userData.correo || "",
          fechaNacimiento:
            userData.fechaNacimiento ||
            userData.fecha_nacimiento ||
            userData.birthDate ||
            "",
          sexo: userData.sexo || userData.genero || userData.gender || "",
          pais: paisValue,
          departamento: userData.departamento || userData.department || "",
          municipio: userData.municipio || userData.municipality || "",
          nit: userData.nit || "",
          telefono: userData.telefono || userData.phone || "",
          entidad: userData.entidad || userData.entity || "",
          dependencia: userData.dependencia || userData.dependency || "",
          renglon: userData.renglon || userData.budget_line || "",
          colegio: userData.colegio || userData.college || "",
          numeroColegiado:
            userData.numeroColegiado ||
            userData.numero_colegiado ||
            userData.professional_number ||
            "",
          message: "Datos encontrados",
        },
      }

      return result
    }

    // Si no hay datos en la lista o la lista está vacía
    if (
      response.data &&
      response.data.list &&
      response.data.list.length === 0
    ) {
      return {
        success: true,
        data: {
          dpi: data.dpi,
          primerNombre: "",
          segundoNombre: "",
          primerApellido: "",
          segundoApellido: "",
          email: "",
          fechaNacimiento: "",
          sexo: "",
          pais: "Guatemala",
          departamento: "",
          municipio: "",
          nit: "",
          telefono: "",
          entidad: "",
          dependencia: "",
          renglon: "",
          colegio: "",
          numeroColegiado: "",
          message: "DPI no encontrado - complete los campos manualmente",
        },
      }
    }

    return {
      success: false,
      error: {
        status: 500,
        message: "No se recibieron datos del servidor",
        error: "No Data",
      },
    }
  } catch (error: any) {
    console.error("Prefill error:", error)
    console.error("Error response:", error.response?.data)

    if (error.response?.status === 404) {
      // DPI no encontrado, devolver formulario vacío para que el usuario llene manualmente
      return {
        success: true,
        data: {
          dpi: data.dpi,
          primerNombre: "",
          segundoNombre: "",
          primerApellido: "",
          segundoApellido: "",
          email: "",
          fechaNacimiento: "",
          sexo: "",
          pais: "Guatemala",
          departamento: "",
          municipio: "",
          nit: "",
          telefono: "",
          entidad: "",
          dependencia: "",
          renglon: "",
          colegio: "",
          numeroColegiado: "",
          message: "DPI no encontrado - complete los campos manualmente",
        },
      }
    }

    return {
      success: false,
      error: {
        status: error.response?.status || 500,
        message:
          error.response?.data?.message ||
          error.message ||
          "Error al consultar DPI",
        error: "API Error",
      },
    }
  }
}

export const signup = async (
  data: z.infer<typeof SignupAllSchema>
): Promise<ISignupCompleteResponseDTO> => {
  try {
    // Obtener el token de autenticación
    const token = await getAuthToken()

    // Crear usuario usando el endpoint de usuarios
    const response = await externalApi.post(
      "/usuarios",
      {
        dpi: data.dpi,
        email: data.email,
        password: data.password,
        primerNombre: data.primerNombre,
        segundoNombre: data.segundoNombre,
        primerApellido: data.primerApellido,
        segundoApellido: data.segundoApellido,
        nit: data.nit,
        sexo: data.sexo,
        fechaNacimiento: data.fechaNacimiento,
        departamento: data.departamento_residencia,
        municipio: data.municipio_residencia,
        telefono: data.telefono,
        entidad: data.entidad,
        dependencia: data.dependencia,
        renglon: data.renglon,
        colegio: data.colegio,
        numeroColegiado: data.numeroColegiado,
        pais: data.pais,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (response.data && (response.status === 200 || response.status === 201)) {
      return {
        success: true,
        data: {
          userId: response.data.id || data.dpi,
          message: "Usuario registrado exitosamente",
        },
      }
    }

    return {
      success: false,
      error: {
        status: 500,
        message: "No se recibió respuesta válida del servidor",
        error: "No Response",
      },
    }
  } catch (error: any) {
    console.error("Signup error:", error)

    if (error.response?.status === 409 || error.response?.status === 400) {
      return {
        success: false,
        error: {
          status: error.response.status,
          message: "El usuario ya existe o datos inválidos",
          error: "User Already Exists",
        },
      }
    }

    return {
      success: false,
      error: {
        status: error.response?.status || 500,
        message:
          error.response?.data?.message ||
          error.message ||
          "Error al crear usuario",
        error: "API Error",
      },
    }
  }
}

// Funciones adicionales que podrían usar la API externa
export const getUsers = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<IUserListResponseDTO> => {
  try {
    const token = await getAuthToken()

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    if (search) {
      params.append("search", search)
    }

    const response = await externalApi.get(`/usuarios?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: {
          users: (response.data.users || []).map((user: any) => ({
            id: user.id,
            email: user.email,
            primerNombre: user.primerNombre,
            primerApellido: user.primerApellido,
            dpi: user.dpi,
            created_at: user.created_at || new Date().toISOString(),
          })),
          total: response.data.total || 0,
          page,
          limit,
        },
      }
    }

    return {
      success: false,
      error: {
        status: response.status,
        message: "Error al obtener usuarios",
        error: "Fetch Failed",
      },
    }
  } catch (error: any) {
    return {
      success: false,
      error: {
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Error al obtener usuarios",
        error: error.response?.data?.error || "Internal Server Error",
      },
    }
  }
}

export const getUserById = async (
  id: string
): Promise<IUserDetailResponseDTO> => {
  try {
    const token = await getAuthToken()

    const response = await externalApi.get(`/usuarios/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
      }
    }

    return {
      success: false,
      error: {
        status: response.status,
        message: "Error al obtener usuario",
        error: "Fetch Failed",
      },
    }
  } catch (error: any) {
    return {
      success: false,
      error: {
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Error al obtener usuario",
        error: error.response?.data?.error || "Internal Server Error",
      },
    }
  }
}

export const updateUser = async (
  id: string,
  data: Partial<z.infer<typeof SignupAllSchema>>
): Promise<IUserDetailResponseDTO> => {
  try {
    const token = await getAuthToken()

    const response = await externalApi.put(`/usuarios/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
      }
    }

    return {
      success: false,
      error: {
        status: response.status,
        message: "Error al actualizar usuario",
        error: "Update Failed",
      },
    }
  } catch (error: any) {
    return {
      success: false,
      error: {
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Error al actualizar usuario",
        error: error.response?.data?.error || "Internal Server Error",
      },
    }
  }
}

export const deleteUser = async (
  id: string
): Promise<IUserDetailResponseDTO> => {
  try {
    const token = await getAuthToken()

    const response = await externalApi.delete(`/usuarios/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.data && response.status === 200) {
      return {
        success: true,
        data: response.data,
      }
    }

    return {
      success: false,
      error: {
        status: response.status,
        message: "Error al eliminar usuario",
        error: "Delete Failed",
      },
    }
  } catch (error: any) {
    return {
      success: false,
      error: {
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Error al eliminar usuario",
        error: error.response?.data?.error || "Internal Server Error",
      },
    }
  }
}
