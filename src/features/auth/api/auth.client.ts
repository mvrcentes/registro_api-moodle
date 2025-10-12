"use client"

import axios from "axios"
import { isAxiosError, parseAxiosError } from "@/lib/api-utils"
// #region Local API
import { apiLocal } from "@/services/axiosLocal"
import type { LoginDTO, LoginResponse, MeResponse } from "./auth.dto"
// #endregion

import type {
  ISigninResponseDTO,
  ISignupPreFillResponseDTO,
  ISignupCompleteResponseDTO,
  IUserListResponseDTO,
  IUserDetailResponseDTO,
} from "../../api/types"
import type {
  SigninSchema,
  SignupPreFillSchema,
  SignupAllSchema,
} from "@/features/auth/schemas/auth.schema"
import type { z } from "zod"

// #region Local API
// Cliente para autenticación LOCAL (tu backend)
export const LocalAuthApi = {
  login: (data: LoginDTO) =>
    apiLocal.post<LoginResponse>("/admin/login", data).then((r) => r.data),

  me: () => apiLocal.get<MeResponse>("/admin/me").then((r) => r.data),

  logout: () =>
    apiLocal.post<{ ok: boolean }>("/admin/logout").then((r) => r.data),

  // common endpoints
  meAny: () => apiLocal.get<MeResponse>("/me").then((r) => r.data),
}

// Configuración de la API externa
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_PREFILL_API_URL,
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

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v)

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
    if (response.data?.token) {
      extractedToken = response.data.token

      // Si el token es un objeto con un campo 'value', extraer ese valor
      if (typeof extractedToken === "object" && extractedToken.value) {
        extractedToken = extractedToken.value
      }
    } else if (response.data?.data?.token) {
      extractedToken = response.data.data.token

      if (typeof extractedToken === "object" && extractedToken.value) {
        extractedToken = extractedToken.value
      }
    } else if (response.data?.accessToken) {
      extractedToken = response.data.accessToken
    } else if (response.data?.access_token) {
      extractedToken = response.data.access_token
    } else if (typeof response.data === "string") {
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
  } catch (error: unknown) {
    console.error("Error getting auth token:", error)
    clearStoredToken()

    if (isAxiosError(error) && error.response?.status === 409) {
      const respData = error.response.data as unknown
      if (isRecord(respData)) {
        const maybeToken = (respData as Record<string, unknown>).token
        if (typeof maybeToken === "string") {
          authToken = maybeToken
          tokenExpiry = Date.now() + 60 * 60 * 1000
          return authToken
        }
        if (isRecord(maybeToken) && typeof maybeToken.value === "string") {
          authToken = maybeToken.value
          tokenExpiry = Date.now() + 60 * 60 * 1000
          return authToken
        }
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
  } catch (error: unknown) {
    console.error("Signin error:", error)
    const { status, message, error: errStr } = parseAxiosError(error)
    return {
      success: false,
      error: {
        status: status || 500,
        message: message || "Error al iniciar sesión",
        error: errStr || "API Error",
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

    if (response.data?.list && response.data.list.length > 0) {
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
          email:
            userData.correoPersonal || userData.email || userData.correo || "",
          correoInstitucional:
            userData.correoInstitucional || userData.correo_institucional || "",
          correoPersonal:
            userData.correoPersonal ||
            userData.correo_personal ||
            userData.email ||
            userData.correo ||
            "",
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
          institucion:
            userData.institucion || userData.entidad || userData.entity || "",
          dependencia: userData.dependencia || userData.dependency || "",
          renglon: userData.renglon || userData.budget_line || "",
          profesion: userData.profesion || userData.profession || "",
          puesto: userData.puesto || userData.position || "",
          sector: userData.sector || userData.sector_laboral || "",
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
    if (response.data?.list && response.data.list.length === 0) {
      return {
        success: true,
        data: {
          dpi: data.dpi,
          primerNombre: "",
          segundoNombre: "",
          primerApellido: "",
          segundoApellido: "",
          email: "",
          correoInstitucional: "",
          correoPersonal: "",
          fechaNacimiento: "",
          sexo: "",
          pais: "Guatemala",
          departamento: "",
          municipio: "",
          nit: "",
          telefono: "",
          entidad: "",
          institucion: "",
          dependencia: "",
          renglon: "",
          profesion: "",
          puesto: "",
          sector: "",
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
  } catch (error: unknown) {
    console.error("Prefill error:", error)
    if (isAxiosError(error) && error.response?.status === 404) {
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
          correoInstitucional: "",
          correoPersonal: "",
          fechaNacimiento: "",
          sexo: "",
          pais: "Guatemala",
          departamento: "",
          municipio: "",
          nit: "",
          telefono: "",
          entidad: "",
          institucion: "",
          dependencia: "",
          renglon: "",
          profesion: "",
          puesto: "",
          sector: "",
          colegio: "",
          numeroColegiado: "",
          message: "DPI no encontrado - complete los campos manualmente",
        },
      }
    }
    const { status, message, error: errStr } = parseAxiosError(error)
    return {
      success: false,
      error: {
        status: status || 500,
        message: message || "Error al consultar DPI",
        error: errStr || "API Error",
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
        correoInstitucional: data.correoInstitucional,
        correoPersonal: data.correoPersonal,
        nit: data.nit,
        sexo: data.sexo,
        fechaNacimiento: data.fechaNacimiento,
        departamento: data.departamento_residencia,
        municipio: data.municipio_residencia,
        telefono: data.telefono,
        entidad: data.entidad,
        institucion: data.institucion || data.entidad,
        dependencia: data.dependencia,
        renglon: data.renglon,
        profesion: data.profesion,
        puesto: data.puesto,
        sector: data.sector,
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
  } catch (error: unknown) {
    console.error("Signup error:", error)
    if (
      isAxiosError(error) &&
      (error.response?.status === 409 || error.response?.status === 400)
    ) {
      return {
        success: false,
        error: {
          status: error.response.status,
          message: "El usuario ya existe o datos inválidos",
          error: "User Already Exists",
        },
      }
    }
    const { status, message, error: errStr } = parseAxiosError(error)
    return {
      success: false,
      error: {
        status: status || 500,
        message: message || "Error al crear usuario",
        error: errStr || "API Error",
      },
    }
  }
}

interface ExternalUser {
  id?: string
  email?: string
  primerNombre?: string
  primerApellido?: string
  dpi?: string
  created_at?: string
}

// Funciones adicionales que podrían usar la API externa
export const getUsers = async (
  page = 1,
  limit = 10,
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
          users: (
            (response.data.users as ExternalUser[] | undefined) ?? []
          ).map((user) => ({
            id: user.id ?? "",
            email: user.email ?? "",
            primerNombre: user.primerNombre ?? "",
            primerApellido: user.primerApellido ?? "",
            dpi: user.dpi ?? "",
            created_at: user.created_at ?? new Date().toISOString(),
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
  } catch (error: unknown) {
    const { status, message, error: errStr } = parseAxiosError(error)
    return {
      success: false,
      error: {
        status: status || 500,
        message: message || "Error al obtener usuarios",
        error: errStr || "Internal Server Error",
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
  } catch (error: unknown) {
    const { status, message, error: errStr } = parseAxiosError(error)
    return {
      success: false,
      error: {
        status: status || 500,
        message: message || "Error al obtener usuario",
        error: errStr || "Internal Server Error",
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
  } catch (error: unknown) {
    const { status, message, error: errStr } = parseAxiosError(error)
    return {
      success: false,
      error: {
        status: status || 500,
        message: message || "Error al actualizar usuario",
        error: errStr || "Internal Server Error",
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
  } catch (error: unknown) {
    const { status, message, error: errStr } = parseAxiosError(error)
    return {
      success: false,
      error: {
        status: status || 500,
        message: message || "Error al eliminar usuario",
        error: errStr || "Internal Server Error",
      },
    }
  }
}
