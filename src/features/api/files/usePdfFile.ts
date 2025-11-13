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
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let objectUrl: string | null = null

    const fetchPdf = async () => {
      try {
        setLoading(true)
        setError(null)

        const blob = await FilesApi.getFile(fileId)
        objectUrl = URL.createObjectURL(blob)
        setPdfUrl(objectUrl)
      } catch (err: any) {
        console.error('Error fetching PDF:', err)
        setError(err.response?.data?.error || 'Error al cargar el archivo')
      } finally {
        setLoading(false)
      }
    }

    fetchPdf()

    // Cleanup: revocar el object URL cuando el componente se desmonte
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [fileId])

  return { pdfUrl, loading, error }
}
