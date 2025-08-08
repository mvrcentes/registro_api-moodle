import { z } from "zod"

export const SigninSchema = z.object({
  email: z.email("Dirección de correo electrónico no válida"),
  password: z.string().min(6, "La contraseña debe ser llenada"),
})
