import axios from "axios"

// Cliente para el API externo de Moodle
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
})

// Request interceptor para headers por defecto
api.interceptors.request.use(
    (config) => {
        config.headers['Content-Type'] = 'application/json'
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor para manejar errores globales
api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        console.error('API Error:', error.response?.data || error.message)
        return Promise.reject(error)
    }
)

export default api