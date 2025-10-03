// User Types
export interface User {
  id: string
  email: string
  primerNombre: string
  primerApellido: string
  dpi: string
  role?: string
  created_at?: string
}

export interface UserData {
  dpi: string
  primerNombre: string
  segundoNombre?: string
  primerApellido: string
  segundoApellido?: string
  primer_nombre?: string
  segundo_nombre?: string
  primer_apellido?: string
  segundo_apellido?: string
  email: string
  correo?: string
  correoInstitucional?: string
  correoPersonal?: string
  correo_institucional?: string
  correo_personal?: string
  fechaNacimiento?: string
  sexo?: string
  pais?: string
  departamento?: string
  municipio?: string
  nit?: string
  telefono?: string
  entidad?: string
  entity?: string
  institucion?: string
  dependencia?: string
  renglon?: string
  budget_line?: string
  profesion?: string
  profession?: string
  puesto?: string
  position?: string
  sector?: string
  sector_laboral?: string
  colegio?: string
  numeroColegiado?: string
  numero_colegiado?: string
  message?: string
}
