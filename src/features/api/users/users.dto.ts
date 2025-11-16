import type { UserOverview } from "@/app/(app)/settings/users/components/users.types"

export interface UsersListResponseDTO {
  ok: boolean
  status: number
  data: UserOverview[]
}

export interface UserDetailResponseDTO {
  ok: boolean
  status: number
  data: UserOverview
}

export interface UsersCreateResponseDTO {
  ok: boolean
  data: UserOverview
}
