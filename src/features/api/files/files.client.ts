"use client"

import { apiLocal } from "@/services/axiosLocal"

export const FilesApi = {
  /**
   * Obtiene un archivo del backend como Blob
   * @param fileId - ID del archivo a obtener
   * @returns Promise con el Blob del archivo
   */
  getFile: async (fileId: string): Promise<Blob> => {
    const response = await apiLocal.get(`/files/${fileId}`, {
      responseType: 'blob',
    })
    return response.data
  },
}
