import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_BASE_URL = process.env.API_URL ?? "http://localhost:4000/api/v1"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    // Obtener la cookie de sesión
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("sid") || cookieStore.get("__Host-sid")

    if (!sessionCookie) {
      return NextResponse.json(
        { ok: false, error: "No autenticado" },
        { status: 401 }
      )
    }

    // Mapear los modos del frontend a los status del backend
    const statusMap: Record<string, string> = {
      approve: "approved",
      reject: "rejected",
      in_review: "in_review"
    }

    // Convertir el status/mode al formato del backend
    const incomingStatus = body.status || body.mode
    const mappedStatus = statusMap[incomingStatus] || incomingStatus

    const requestBody = {
      status: mappedStatus,
      note: body.note
    }

    // Hacer la petición al backend
    const baseUrl = API_BASE_URL.replace(/\/$/, "")
    const response = await fetch(`${baseUrl}/applications/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `${sessionCookie.name}=${sessionCookie.value}`,
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: data.error || "Error al actualizar estado" },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error proxying status update:", error)
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
