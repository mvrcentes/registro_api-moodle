import type { UserOverview } from "@/app/(app)/settings/users/components/users.types"

export interface UsersListResponseDTO {
  ok: boolean
  status: number
  users: UserOverview[]
}

export interface UserDetailResponseDTO {
  ok: boolean
  status: number
  users: UserOverview
}
