import { z } from "zod"

// #region Internal API
export const SigninInternalSchema = z.object({
  email: z.email("Dirección de correo electrónico no válida"),
  password: z.string().min(8, "La contraseña debe ser llenada"),
})

const StrongPassword =
  /^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*\d)(?=.*[^\p{L}\p{N}]).{8,}$/u

export const SigninSchema = z.object({
  dpi: z
    .string()
    .trim()
    .regex(/^\d{13}$/, "El DPI debe tener exactamente 13 dígitos"),
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

    correoPersonal: z.string().email("Correo personal no válido"),
    confirm_correoPersonal: z.string().email("Correo personal no válido"),

    correoInstitucional: z.string().email("Correo institucional no válido"),
    confirm_correoInstitucional: z.string().email("Correo institucional no válido"),

    primerNombre: z.string().min(2, "El primer nombre es obligatorio"),
    segundoNombre: z.string().optional(),
    primerApellido: z.string().min(2, "El primer apellido es obligatorio"),
    segundoApellido: z.string().min(2, "El segundo apellido es obligatorio"),

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
  // Igualdad de correo personal
  .refine((data) => data.correoPersonal === data.confirm_correoPersonal, {
    message: "Los correos personales no coinciden",
    path: ["confirm_correoPersonal"],
  })
  // Igualdad de correo institucional
  .refine((data) => data.correoInstitucional === data.confirm_correoInstitucional, {
    message: "Los correos institucionales no coinciden",
    path: ["confirm_correoInstitucional"],
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
  fechaNacimiento: z.string().optional(),
  edad: z
    .number()
    .min(18, "La edad debe ser mínimo 18 años")
    .max(100, "La edad debe ser máximo 100 años")
    .optional(),
  departamento_residencia: z.string().min(2, "El departamento es obligatorio"),
  municipio_residencia: z.string().min(2, "El municipio es obligatorio"),
  etnia: z.enum(["MAYA", "XINCA", "GARIFUNA", "LADINOS", "EXTRANJERO", "OTRA"], {
    errorMap: () => ({ message: "Debe seleccionar una etnia válida" }),
  }),
  telefono: z.string().min(8, "El teléfono es obligatorio"),
})

export const SignupInstitutionSchema = z.object({
  entidad: z.string().min(2, "La entidad es obligatoria"),
  institucion: z.string().min(2, "La institución es obligatoria"),
  dependencia: z.string().optional(),
  renglon: z.string().min(2, "El renglón presupuestario es obligatorio"),
})

export const SignupProfessionalInfoSchema = z.object({
  profesion: z.union([
    z.literal(""),
    z.string().min(2, "Debe contener al menos 2 caracteres"),
  ]),
  puesto: z.union([
    z.literal(""),
    z.string().min(2, "Debe contener al menos 2 caracteres"),
  ]),
  sector: z.union([
    z.literal(""),
    z.string().min(2, "Debe contener al menos 2 caracteres"),
  ]),
  colegio: z
    .string()
    .min(2, "El nombre del colegio profesional es obligatorio"),
  numeroColegiado: z.string().min(1, "El número de colegiado es obligatorio"),
})

export const SignupFilesFormSchema = z.object({
  pdf_dpi: z.instanceof(File),
  pdf_contrato: z.instanceof(File),
  pdf_certificado_profesional: z.instanceof(File),
})

export const SignupAllSchema = z.object({
  ...SignupPreFillSchema.shape,
  ...SignupCompleteSchema.shape,
  ...SignupDemographicSchema.shape,
  ...SignupInstitutionSchema.shape,
  ...SignupProfessionalInfoSchema.shape,
  ...SignupFilesFormSchema.shape,
})

export type SignupAllValues = z.infer<typeof SignupAllSchema>
