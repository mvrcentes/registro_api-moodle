"use client"

import Link from "next/link"
import Image from "next/image"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import {
  ChevronDown,
  CircleUserRound,
  FileUser,
  Settings,
  ShieldUser,
  Users,
} from "lucide-react"
// import { useAuth } from "@/hooks/useAuth"
// import { useSession } from "@/app/context/SessionContext"
import { Skeleton } from "./ui/skeleton"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"

export function AppSidebar() {
  // const { loading } = useAuth()
  const { state } = useSidebar()
  // const { currentAccess } = useSession()
  // const role = currentAccess?.selectedRole ?? "RESIDENT"

  // if (loading) {
  //   return (
  //     <Sidebar collapsible="icon">
  //       <SidebarHeader>
  //         <div className="flex justify-center p-4">
  //           <Skeleton className="w-6 h-6 rounded-full" />
  //         </div>
  //       </SidebarHeader>
  //       <SidebarContent>
  //         <SidebarMenu>
  //           {Array.from({ length: 4 }).map((_, i) => (
  //             <SidebarMenuItem key={i}>
  //               <Skeleton className="w-28 h-4 ml-4" />
  //             </SidebarMenuItem>
  //           ))}
  //         </SidebarMenu>
  //       </SidebarContent>
  //     </Sidebar>
  //   )
  // }

  return (
    <Sidebar collapsible="icon">
      {/* <SidebarHeader className="w-full ml-auto">
        <SidebarTrigger className="h-8 w-8 ml-auto" />
      </SidebarHeader> */}
      <SidebarContent>
        {/* Finanzas */}
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Solicitudes
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link
                        href="/applications"
                        className="flex items-center gap-2">
                        <FileUser />
                        <span>Todas</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Configuración */}
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Configuración
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <Collapsible className="group" defaultOpen>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="flex items-center w-full gap-2">
                          <Users className="w-4 h-4" />
                          <span className="flex-1 text-left">Usuarios</span>
                          <ChevronDown className="transition-transform group-data-[state=open]:rotate-180 ml-auto" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link
                                href="/settings/users/admins"
                                className="flex items-center gap-2">
                                <ShieldUser className="w-4 h-4" />
                                <span>Amistrativos</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <Link
                                href="/settings/users/applicants"
                                className="flex items-center gap-2">
                                <CircleUserRound className="w-4 h-4" />
                                <span>Solicitantes</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link
                          href="/settings"
                          className="flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          <span>Configuración</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </Collapsible>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
    </Sidebar>
  )
}
