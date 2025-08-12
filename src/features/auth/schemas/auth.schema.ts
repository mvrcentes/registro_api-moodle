import { z } from "zod"

const StrongPassword =
  /^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*\d)(?=.*[^\p{L}\p{N}]).{8,}$/u

export const SigninSchema = z.object({
  email: z.email("Dirección de correo electrónico no válida"),
  password: z.string().min(6, "La contraseña debe ser llenada"),
})

export const SignupPreFillSchema = z.object({
  dpi: z
    .string()
    .trim()
    .regex(/^\d{13}$/, "El DPI debe tener exactamente 13 dígitos"),
})

export const SignupCompleteSchema = z
  .object({
    dpi: z
      .string()
      .min(13, "El DPI es obligatorio")
      .max(13, "El DPI debe tener 13 caracteres"),

    email: z.email("Dirección de correo electrónico no válida"),
    confirm_email: z.email("Dirección de correo electrónico no válida"),

    nombres: z.string().min(2, "Los nombres son obligatorios"),
    apellidos: z.string().min(2, "Los apellidos son obligatorios"),

    // Reglas: mínimo 8, 1 mayúscula, 1 minúscula, 1 número, 1 símbolo
    password: z
      .string()
      .regex(
        StrongPassword,
        "Debe tener mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número, 1 símbolo"
      ),

    confirm_password: z.string().min(8, "La confirmación es obligatoria"),

    pais: z.string().min(2, "El país es obligatorio"),
    ciudad: z.string().min(2, "La ciudad es obligatoria"),
  })
  // Igualdad de emails
  .refine((data) => data.email === data.confirm_email, {
    message: "Los correos no coinciden",
    path: ["confirm_email"], // el error se muestra bajo el campo de confirmación
  })
  // Igualdad de contraseñas
  .refine((data) => data.password === data.confirm_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirm_password"],
  })

export const SignupDemographicSchema = z.object({
  cui: z
    .string()
    .min(13, "El CUI es obligatorio")
    .max(13, "El CUI debe tener 13 caracteres"),
  nit: z
    .string()
    .min(8, "El NIT debe tener mínimo 8 dígitos")
    .max(9, "El NIT debe tener máximo 9 dígitos"),
  sexo: z.string().min(2, "El género es obligatorio"),
  edad: z.number().min(18, "La edad mínima es 18 años").max(100, "La edad máxima es 100 años").optional(),
  departamento_residencia: z.string().min(2, "El departamento es obligatorio"),
  municipio_residencia: z.string().min(2, "El municipio es obligatorio"),
  celular: z.string().min(8, "El teléfono es obligatorio"),
})

export const SignupInstitutionSchema = z.object({
  entidad: z.string().min(2, "La entidad es obligatoria"),
  dependencia: z.string().min(2, "La dependencia es obligatoria"),
  renglon: z.string().min(2, "El renglón presupuestario es obligatorio"),
})

export const SignupProfessionalInfoSchema = z.object({
  colegio: z.string().min(2, "El nombre del colegio profesional es obligatorio"),
  numeroColegiado: z.string().min(1, "El número de colegiado es obligatorio"),
})

export const SignupAllSchema = z.object({
  ...SignupPreFillSchema.shape,
  ...SignupCompleteSchema.shape,
  ...SignupDemographicSchema.shape,
  ...SignupInstitutionSchema.shape,
  ...SignupProfessionalInfoSchema.shape,
})

export type SignupAllValues = z.infer<typeof SignupAllSchema>
