import { UserRole } from "@/features/auth/api/auth.dto"
import { z } from "zod"

export const UserSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "El apellido es obligatorio"),
  email: z.email("Correo electrónico no válido"),
  role: z.enum(UserRole),
})
