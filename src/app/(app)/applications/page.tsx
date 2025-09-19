import { columns } from "./components/applications-columns"
import { DataTable } from "./components/applications-table"
import { ApplicationRow } from "./components/types"

async function getApplications(): Promise<ApplicationRow[]> {
  // TODO: reemplaza por fetch a tu API interna
  return [
    {
      id: "app_001",
      email: "maria@example.com",
      primerNombre: "María",
      segundoNombre: "Fernanda",
      primerApellido: "López",
      segundoApellido: "García",
      dpi: "1234567890123",
      entidad: "SECTOR EDUCACIÓN, CIENCIA, CULTURA Y DEPORTES",
      institucion: "MINISTERIO DE EDUCACIÓN",
      renglon: "PERSONAL PERMANENTE 011",
      status: "pending",
      submittedAt: "2025-09-10T15:30:00Z",
    },
    {
      id: "app_002",
      email: "juan@example.com",
      primerNombre: "Juan",
      primerApellido: "Pérez",
      dpi: "9876543210987",
      entidad: "SECTOR SALUD Y SEGURIDAD SOCIAL",
      institucion: "MINISTERIO DE SALUD PÚBLICA Y ASISTENCIA SOCIAL",
      renglon: "GRUPO 029",
      status: "in_review",
      submittedAt: "2025-09-12T17:45:00Z",
    },
  ]
}

export default async function ApplicationsPage() {
  const data = await getApplications()
  return (
    <div className="w-full">
      <h1 className="mb-6 text-2xl font-semibold">Solicitudes</h1>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
