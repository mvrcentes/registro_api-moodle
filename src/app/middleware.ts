import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value

  // Ejemplo: no autenticado → login
  if (!token && !req.nextUrl.pathname.startsWith("/")) {
    return NextResponse.redirect(new URL("/auth/signin", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"], // Proteger todo excepto assets
}
