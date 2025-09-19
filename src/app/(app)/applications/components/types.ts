import {
  EntidadValue,
  InstitucionValue,
  RenglonValue,
} from "@/app/auth/signup/components/forms/types"

export type ApplicationStatus =
  | "pending"
  | "in_review"
  | "approved"
  | "rejected"

// Fila que mostrará la tabla (decisión)
export interface ApplicationRow {
  id: string
  email: string
  primerNombre: string
  segundoNombre?: string
  primerApellido: string
  segundoApellido?: string
  dpi: string
  entidad: EntidadValue
  institucion: InstitucionValue
  renglon: RenglonValue
  status: ApplicationStatus
  submittedAt: string // ISO
  // Campos sólo para modal (se cargarán al abrirlo)
  // etnia?: EtniaValue
  // dependencia?: string
  // colegio?: string
}

