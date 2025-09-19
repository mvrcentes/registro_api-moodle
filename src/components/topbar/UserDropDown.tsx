"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import { useAuth } from "@/hooks/useAuth"

const UserDropDown = () => {
  //   const { user } = useAuth()
  const user = { name: "Usuario Ejemplo", email: "correo@ejemplo.com" }
  const initial = user?.name?.charAt(0).toUpperCase() || "U"

  const handleLogout = () => {
    // Aquí va la lógica de logout (limpiar tokens, redireccionar, etc.)
    console.log("Cerrar sesión")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full w-8 h-8 p-0">
          {initial}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>{user?.name ?? "Usuario"}</DropdownMenuLabel>
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          {user?.email ?? "correo@ejemplo.com"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropDown
