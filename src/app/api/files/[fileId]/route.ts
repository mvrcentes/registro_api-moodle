import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_BASE_URL =
  process.env.API_URL ?? "http://localhost:4000/api/v1"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ fileId: string }> }
) {
  try {
    // En Next.js 15, params es una Promise
    const { fileId } = await context.params

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      )
    }

    // Obtener las cookies para autenticación
    const cookieStore = await cookies()
    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ")

    // Construir la URL del backend
    const baseUrl = API_BASE_URL.replace(/\/$/, "")
    const backendUrl = `${baseUrl}/files/${fileId}`

    // Hacer la petición al backend con las cookies de autenticación
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
      cache: "no-store",
    })

    // Si el backend devuelve un error, propagarlo
    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `Backend error: ${response.status}`

      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.error || errorMessage
      } catch {
        // Si no es JSON, usar el texto plano
        errorMessage = errorText || errorMessage
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    // Obtener el contenido del archivo como ArrayBuffer
    const fileBuffer = await response.arrayBuffer()

    // Obtener los headers del backend
    const contentType = response.headers.get("content-type") || "application/pdf"
    const contentDisposition = response.headers.get("content-disposition")

    // Crear la respuesta con el archivo
    const fileResponse = new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileBuffer.byteLength.toString(),
        "Cache-Control": "private, max-age=3600", // Cache por 1 hora
      },
    })

    // Agregar content-disposition si existe
    if (contentDisposition) {
      fileResponse.headers.set("Content-Disposition", contentDisposition)
    }

    return fileResponse
  } catch (error) {
    console.error("Error in file proxy:", error)
    return NextResponse.json(
      { error: "Failed to fetch file" },
      { status: 500 }
    )
  }
}