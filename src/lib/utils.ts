import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ColegioValue } from "@/app/auth/signup/components/forms/types"
import { ApplicationRow } from "@/app/(app)/applications/components/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const norm = (s?: string) =>
  (s ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}+/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase()

const hasAll = (s: string, ...words: string[]) =>
  words.every((w) => s.includes(w))
const hasAny = (s: string, ...words: string[]) =>
  words.some((w) => s.includes(w))

export function mapColegioApiToValue(input?: string): ColegioValue | undefined {
  const S = norm(input)

  if (!S || S === "NO APLICA") return "NO APLICA"

  // Atajos por siglas comunes
  if (hasAny(S, "CCEE")) {
    return "COLEGIO DE ECONOMISTAS, CONTADORES PUBLICOS Y AUDITORES Y ADMINISTRADORES DE EMPRESAS"
  }
  if (hasAny(S, "CPA")) {
    return "COLEGIO DE CONTADORES PUBLICOS Y AUDITORES DE GUATEMALA"
  }
  if (hasAny(S, "COFAQUI")) {
    return "COLEGIO DE FARMACEUTICOS Y QUIMICOS DE GUATEMALA"
  }
  if (hasAny(S, "CIG") && !hasAny(S, "CIQ", "CIAG")) {
    return "COLEGIO DE INGENIEROS DE GUATEMALA"
  }
  if (hasAny(S, "CIAG")) {
    return "COLEGIO DE INGENIEROS AGRONOMOS DE GUATEMALA"
  }
  if (hasAny(S, "CIQ")) {
    return "COLEGIO DE INGENIEROS QUIMICOS DE GUATEMALA"
  }
  if (hasAny(S, "CMVZ")) {
    return "COLEGIO DE MEDICOS VETERINARIOS Y ZOOTECNISTAS DE GUATEMALA"
  }
  if (hasAny(S, "COLMED")) {
    return "COLEGIO DE MEDICOS Y CIRUJANOS DE GUATEMALA"
  }
  if (hasAny(S, "CANG")) {
    return "COLEGIO DE ABOGADOS Y NOTARIOS DE GUATEMALA"
  }

  // Reglas por palabras clave (orden importa; de más específico a más genérico)
  if (
    hasAny(S, "ECONOMISTA", "ECONOMISTAS") ||
    (hasAll(S, "CONTADORES", "PUBLICOS") &&
      hasAny(S, "AUDITORES", "AUDITOR")) ||
    hasAll(S, "ADMINISTRADORES", "EMPRESAS")
  ) {
    return "COLEGIO DE ECONOMISTAS, CONTADORES PUBLICOS Y AUDITORES Y ADMINISTRADORES DE EMPRESAS"
  }

  if (
    hasAny(S, "CONTADOR PUBLICO", "CONTADORES PUBLICOS", "AUDITOR", "AUDITORES")
  ) {
    return "COLEGIO DE CONTADORES PUBLICOS Y AUDITORES DE GUATEMALA"
  }

  if (hasAny(S, "FARMACEUTICO", "FARMACEUTICOS", "QUIMICO", "QUIMICOS")) {
    return "COLEGIO DE FARMACEUTICOS Y QUIMICOS DE GUATEMALA"
  }

  if (
    hasAll(S, "INGENIEROS", "AGRONOMOS") ||
    hasAll(S, "INGENIERO", "AGRONOMO")
  ) {
    return "COLEGIO DE INGENIEROS AGRONOMOS DE GUATEMALA"
  }

  if (
    hasAll(S, "INGENIEROS", "QUIMICOS") ||
    hasAll(S, "INGENIERO", "QUIMICO")
  ) {
    return "COLEGIO DE INGENIEROS QUIMICOS DE GUATEMALA"
  }

  if (hasAny(S, "INGENIERO", "INGENIEROS")) {
    return "COLEGIO DE INGENIEROS DE GUATEMALA"
  }

  if (hasAll(S, "MEDICOS", "VETERINARIOS") || hasAll(S, "ZOOTECNISTAS")) {
    return "COLEGIO DE MEDICOS VETERINARIOS Y ZOOTECNISTAS DE GUATEMALA"
  }

  if (hasAll(S, "MEDICOS", "CIRUJANOS") || hasAll(S, "MEDICO", "CIRUJANO")) {
    return "COLEGIO DE MEDICOS Y CIRUJANOS DE GUATEMALA"
  }

  if (hasAny(S, "PSICOLOGO", "PSICOLOGOS", "PSICOLOGIA")) {
    return "COLEGIO DE PSICOLOGOS DE GUATEMALA"
  }

  if (
    hasAny(
      S,
      "ESTOMATOLOGICO",
      "ESTOMATOLOGIA",
      "ODONTOLOGO",
      "ODONTOLOGOS",
      "ODONTOLOGIA"
    )
  ) {
    return "COLEGIO ESTOMATOLOGICO DE GUATEMALA"
  }

  if (hasAny(S, "ABOGADO", "ABOGADOS", "NOTARIO", "NOTARIOS")) {
    return "COLEGIO DE ABOGADOS Y NOTARIOS DE GUATEMALA"
  }

  if (hasAny(S, "ENFERMERIA", "ENFERMERA", "ENFERMERO")) {
    return "COLEGIO PROFESIONAL DE ENFERMERIA DE GUATEMALA"
  }

  if (hasAny(S, "HUMANIDADES", "HUMANISTA")) {
    return "COLEGIO PROFESIONAL DE HUMANIDADES DE GUATEMALA"
  }

  // Si no matchea nada claro, no seteamos (o podrías devolver "NO APLICA")
  return undefined
}

// Helpers UI
export function fullName(r: ApplicationRow) {
  return [r.primerNombre, r.segundoNombre, r.primerApellido, r.segundoApellido]
    .filter(Boolean)
    .join(" ")
}

export function maskDPI(dpi: string) {
  // 13 dígitos: ****-****-***-X (ajusta a tu formato real)
  return dpi.replace(/\d(?=\d{4})/g, "•")
}

export function formatDateShort(iso: string) {
  try {
    return new Intl.DateTimeFormat("es-GT", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}
