"use client"

import { useEffect, useState } from "react"
import { FilesApi } from "./files.client"

type UsePdfFileResult = {
  pdfUrl: string | null
  loading: boolean
  error: string | null
}

/**
 * Hook para obtener un archivo PDF del backend usando axios
 * Convierte el Blob en un Object URL para usarlo con react-pdf
 */
export function usePdfFile(fileId: string): UsePdfFileResult {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!fileId) {
      setError('ID de archivo inválido')
      setLoading(false)
      return
    }

    let objectUrl: string | null = null
    let isMounted = true

    const fetchPdf = async () => {
      try {
        setLoading(true)
        setError(null)

        const blob = await FilesApi.getFile(fileId)

        // Validar que el blob sea un PDF
        if (!blob || blob.size === 0) {
          throw new Error('El archivo está vacío')
        }

        if (blob.type && !blob.type.includes('pdf')) {
          console.warn(`Tipo de archivo inesperado: ${blob.type}`)
        }

        // Solo actualizar el estado si el componente sigue montado
        if (isMounted) {
          objectUrl = URL.createObjectURL(blob)
          setPdfUrl(objectUrl)
        }
      } catch (err: any) {
        console.error('Error fetching PDF:', err)
        if (isMounted) {
          setError(err.message || 'Error al cargar el archivo')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchPdf()

    // Cleanup: revocar el object URL cuando el componente se desmonte
    return () => {
      isMounted = false
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [fileId])

  return { pdfUrl, loading, error }
}
