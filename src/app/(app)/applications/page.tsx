import { cookies } from "next/headers"
import { columns } from "./components/applications-columns"
import { DataTable } from "./components/applications-table"
import type { ApplicationDetail } from "./components/types"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"

async function getApplications(): Promise<ApplicationDetail[]> {
  const baseUrl = API_BASE_URL.replace(/\/$/, "")
  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }: { name: string; value: string }) => `${name}=${value}`)
    .join("; ")

  const response = await fetch(`${baseUrl}/applications`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(
      `Failed to fetch applications (${response.status} ${response.statusText})`
    )
  }

  const payload = (await response.json()) as {
    ok?: boolean
    data?: ApplicationDetail[]
  }

  if (payload.ok === false || !Array.isArray(payload.data)) {
    throw new Error("Unexpected response while fetching applications")
  }

  return payload.data
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
