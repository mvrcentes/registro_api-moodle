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
  //   const cookieStore = cookies()
  //   const token = cookieStore.get("accessToken")?.value

  //   if (token) {
  //     try {
  //       const decoded = jwt.verify(
  //         token,
  //         process.env.NEXT_PUBLIC_JWT_SECRET!
  //       ) as {
  //         id: number
  //         email: string
  //         access: {
  //           condominium_id: number
  //           condominium_name: string
  //           roles: string[]
  //           properties: {
  //             property_id: number
  //             identifier: string | null
  //           }[]
  //           selectedProperty?: {
  //             property_id: number
  //             identifier: string | null
  //           }
  //         }[]
  //       }
  //     } catch (e) {
  //       console.warn("Token inválido o expirado")
  //     }
  //   }

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
