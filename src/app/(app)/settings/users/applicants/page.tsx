"use client"

import React from "react"
import { UsersTable } from "../components/users-table"
import { columns } from "../components/users-columns"
import { UserRole } from "@/features/auth/api/auth.dto"
import { useUsers } from "@/features/api/users/useUsers"

const page = () => {
  const { data, loading, error, reload } = useUsers()
  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Cargando solicitudes…</p>
    )
  }

  if (error) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-red-500">
          Error al cargar usuarios: {error}
        </p>
        <button
          type="button"
          onClick={() => void reload()}
          className="text-sm underline">
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="w-full">
      <h1 className="mb-6 text-2xl font-semibold">Usuarios Solicitantes</h1>
      <UsersTable
        columns={columns}
        data={data.filter((user) => user.role === UserRole.APPLICANT)}
      />
    </div>
  )
}

export default page
