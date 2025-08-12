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
  email: string
  fechaNacimiento?: string
  sexo?: string
  pais?: string
  departamento?: string
  municipio?: string
  nit?: string
  telefono?: string
  entidad?: string
  dependencia?: string
  renglon?: string
  colegio?: string
  numeroColegiado?: string
  message?: string
}