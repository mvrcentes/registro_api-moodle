import { ApiResponse } from "@/features/api/types"

export interface ISigninResponseDTO extends ApiResponse {
  data?: {
    //change to data to match the response structure
    //todo:
    token: string
    user: {
      id: string
      email: string
      name: string
    }
  }
}

export interface ISignupPreFillResponseDTO extends ApiResponse {
  data?: {
    cui: string
    // Add other fields as necessary
  }
}
