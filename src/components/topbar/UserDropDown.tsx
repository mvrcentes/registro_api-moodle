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
import { useLogout } from "@/features/auth/api/use-logout"
import { useCurrentUser } from "@/features/auth/api/use-current-user"

const UserDropDown = () => {
  const { user } = useCurrentUser()
  const initial = (user?.name ?? user?.email ?? "U").charAt(0).toUpperCase()

  const logout = useLogout()
  const handleLogout = () => {
    void logout()
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
          {user?.email ?? "—"}
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
