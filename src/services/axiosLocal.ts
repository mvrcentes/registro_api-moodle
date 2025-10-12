import axios from "axios"

export const apiLocal = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
})

// Manejo de errores globales
apiLocal.interceptors.response.use(
  (res) => res,
  (err: unknown) => {
    if (axios.isAxiosError(err) && err.response?.status === 401 && typeof window !== "undefined") {
      window.location.href = "/auth/signin"
    }
    return Promise.reject(err)
  }
)
