"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

import { useAuthGuard } from "@/features/auth/api/use-auth-guard"

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppTopbar } from "@/components/topbar/app-topbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { loading, role } = useAuthGuard()

  useEffect(() => {
    if (loading) return

    const needsAdmin = pathname?.startsWith("/applications")
    if (needsAdmin && role !== "ADMIN") {
      router.replace("/auth/signin")
    }
  }, [loading, role, pathname, router])

  if (loading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Verificando sesión…
      </div>
    )
  }

  return (
    // <SessionProvider>
    <SidebarProvider>
      {/* define la altura de la topbar UNA SOLA VEZ */}
      <div className="min-h-screen w-full overflow-hidden [--topbar-h:3rem] [--content-gap:1rem]">
        <AppSidebar />

        {/* Header fuera del SidebarInset para que NO se empuje */}
        <header className="h-[var(--topbar-h)] sticky top-0 z-50 flex items-center gap-2 border-b bg-background px-3">
          <SidebarTrigger className="shrink-0" />
          <AppTopbar />
        </header>

        <SidebarInset>
          {/* Solo el contenido hace scroll y se empuja por el sidebar */}
          <main className="flex-1 min-h-0 overflow-y-auto bg-background p-4 md:pl-[calc(var(--sidebar-width)+var(--content-gap))] md:peer-data-[collapsible=icon]:pl-[calc(var(--sidebar-width-icon)+var(--content-gap))] md:peer-data-[collapsible=offcanvas]:pl-[var(--content-gap)]">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
    // </SessionProvider>
  )
}
