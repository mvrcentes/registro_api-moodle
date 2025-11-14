import { ApplicationRow } from "./components/types"

// Función para obtener el nombre completo concatenando todos los nombres y apellidos
export function fullName(r: ApplicationRow): string {
  return [r.primerNombre, r.segundoNombre, r.primerApellido, r.segundoApellido]
    .filter(Boolean)
    .join(" ")
}

// Función para enmascarar el DPI mostrando solo los últimos 4 dígitos
export function maskDPI(dpi: string): string {
  return dpi.replace(/\d(?=\d{4})/g, "•")
}

// Función para formatear fechas ISO a formato local
export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("es-GT", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

// Función para determinar el label del archivo basado en su path
export function getFileLabel(filePath: string, index: number): string {
  const path = filePath.toLowerCase()

  if (path.includes("dpi") || path.includes("identificacion")) {
    return "DPI"
  } else if (path.includes("contrato") || path.includes("contract")) {
    return "Contrato"
  } else if (path.includes("certificado") || path.includes("certificate")) {
    return "Certificado"
  } else if (path.includes("titulo") || path.includes("diploma")) {
    return "Título"
  } else if (path.includes("cv") || path.includes("curriculum")) {
    return "CV"
  } else if (path.includes("constancia")) {
    return "Constancia"
  } else if (path.includes("acuerdo")) {
    return "Acuerdo"
  } else {
    return `Documento ${index + 1}`
  }
}
