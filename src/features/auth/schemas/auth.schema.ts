import { z } from "zod"

const StrongPassword =
  /^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*\d)(?=.*[^\p{L}\p{N}]).{8,}$/u

export const SigninSchema = z.object({
  email: z.email("Dirección de correo electrónico no válida"),
  password: z.string().min(6, "La contraseña debe ser llenada"),
})

export const SignupPreFillSchema = z.object({
  cui: z
    .string()
    .trim()
    .regex(/^\d{13}$/, "El CUI debe tener exactamente 13 dígitos"),
})

export const SignupCompleteSchema = z
  .object({
    usuario: z
      .string()
      .min(13, "El CUI es obligatorio")
      .max(13, "El CUI debe tener 13 caracteres"),

    email: z.email("Dirección de correo electrónico no válida"),
    confirm_email: z.email("Dirección de correo electrónico no válida"),

    nombre: z.string().min(2, "El nombre es obligatorio"),
    apellido: z.string().min(2, "El apellido es obligatorio"),

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
    .min(9, "El NIT es obligatorio")
    .max(9, "El NIT debe tener 9 caracteres"),
  sexo: z.string().min(2, "El género es obligatorio"),
  edad: z.coerce
    .number()
    .min(18, "La edad no puede ser menor a 18")
    .max(120, "La edad no puede ser mayor a 120"),
  departamento_residencia: z
    .string()
    .min(2, "El departamento de residencia es obligatorio"),
  municipio_residencia: z
    .string()
    .min(2, "El municipio de residencia es obligatorio"),
  etnia: z.string().min(2, "La etnia es obligatoria"),
  celular: z.string().regex(/^\d{4}-\d{4}$/, { message: "Formato 1234-5678" }),
})

export const SignupInstitutionSchema = z.object({
  sector: z.string().min(2, "El sector es obligatorio"),
  institucion: z.string().min(2, "La institución es obligatoria"),
  ubicacionAdministrativa: z
    .string()
    .min(2, "La ubicación administrativa es obligatoria"),
  renglon_presupuestario: z
    .string()
    .min(2, "El renglón presupuestario es obligatorio"),
})

export const SignupProfessionalInfoSchema = z.object({
  nombre_colegio_profesional: z
    .string()
    .min(2, "El nombre del colegio profesional es obligatorio"),
  numero_colegiado: z.coerce
    .number()
    .min(1, "El número de colegiado es obligatorio")
    .max(999999, "El número de colegiado es demasiado largo"),
})

export const SignupAllSchema = z.object({
  ...SignupPreFillSchema.shape,
  ...SignupCompleteSchema.shape,
  ...SignupDemographicSchema.shape,
  ...SignupInstitutionSchema.shape,
  ...SignupProfessionalInfoSchema.shape,
})

export type SignupAllValues = z.infer<typeof SignupAllSchema>
