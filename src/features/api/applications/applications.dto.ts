import type {
  ApplicationDetail,
  ApplicationStatus,
} from "@/app/(app)/applications/components/types"

// Respuesta del endpoint GET /applications
export interface ApplicationsListResponseDTO {
  ok: boolean
  data: ApplicationDetail[]
}

// Si después tienes GET /applications/:id
export interface ApplicationDetailResponseDTO {
  ok: boolean
  data: ApplicationDetail
}

export interface ApplicationsMetricsResponseDTO {
  ok: boolean
  data: {
    totalApplications: number
    applicationsByStatus: Record<ApplicationStatus, number>
  }
}
