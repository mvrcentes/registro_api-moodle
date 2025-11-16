"use client"
import * as React from "react"
import type { ReactNode } from "react"
import { Form } from "@/components/ui/form"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import type { UserOverview } from "../users.types"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserSchema } from "@/features/api/users/schemas/user.schema"
import type { z } from "zod"
import CustomFormField from "@/components/reusable/CustomFormField"
import { FormFieldType } from "@/lib/types"
import { UsersApi } from "@/features/api/users/users.client"
import {
  generateRandomPassword,
  generateCSVEmailPassword,
  downloadCSV,
} from "@/lib/utils"
import PasswordDialog from "./PasswordDialog"
import { UserRole } from "@/features/auth/api/auth.dto"
import { on } from "events"

type UserValues = z.infer<typeof UserSchema>

export function CreateAdminUserSheet({
  trigger,
  data,
  title = "Información del usuario",
  description = "Detalles del usuario seleccionado",
  children,
  onSuccess,
}: {
  trigger: ReactNode
  data: UserOverview
  title?: string
  description?: string
  children?: ReactNode
  onSuccess?: () => void
}) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [dialogStatus, setDialogStatus] = React.useState<"success" | "error">(
    "success"
  )
  const [dialogMessage, setDialogMessage] = React.useState<string>("")
  const [dialogEmail, setDialogEmail] = React.useState<string>("")
  const [dialogPassword, setDialogPassword] = React.useState<string>("")

  const form = useForm<UserValues>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: UserRole.ADMIN,
    },
  })

  const onSubmit = async (values: UserValues) => {
    setIsLoading(true)
    try {
      // 1) Generar contraseña temporal
      const tempPassword = generateRandomPassword()

      // 2) Llamar API
      const created = await UsersApi.createAdminUser({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        role: values.role,
        password: tempPassword,
      })

      // 3) Actualizar estado del diálogo
      setDialogStatus("success")
      setDialogMessage("El usuario administrativo se creó correctamente.")
      setDialogEmail(created.email)
      setDialogPassword(tempPassword)
      setDialogOpen(true)

      onSuccess?.()

      // 4) Limpiar formulario
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        role: UserRole.ADMIN,
      })
    } catch (error) {
      setDialogStatus("error")
      setDialogMessage("Ocurrió un error al crear el usuario.")
      setDialogEmail("")
      setDialogPassword("")
      setDialogOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadPassword = () => {
    if (!dialogEmail || !dialogPassword) return
    const csv = generateCSVEmailPassword([
      { email: dialogEmail, password: dialogPassword },
    ])
    downloadCSV(csv, "usuarios_admin_credenciales.csv")
  }
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="overflow-y-auto p-4">
        <SheetHeader className="p-0 mt-8">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-1 gap-3">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  name="firstName"
                  label="Nombre"
                  placeholder="Ingrese su nombre"
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  name="lastName"
                  label="Apellido"
                  placeholder="Ingrese su apellido"
                />
              </div>
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="email"
                label="Correo electrónico"
                placeholder="Ingrese su correo electrónico"
              />
            </div>

            <SheetFooter>
              <div className="mt-8 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    form.reset({
                      firstName: "",
                      lastName: "",
                      email: "",
                      role: UserRole.ADMIN,
                    })
                  }
                  disabled={isLoading}>
                  Limpiar
                </Button>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creando..." : "Crear usuario"}
                </Button>
              </div>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>

      <PasswordDialog
        title={
          dialogStatus === "success"
            ? "Usuario creado correctamente"
            : "Error al crear usuario"
        }
        description={
          dialogStatus === "success"
            ? "Comparte estas credenciales de forma segura. La contraseña deberá cambiarse en el primer inicio de sesión."
            : "No se pudo crear el usuario administrativo."
        }
        open={dialogOpen}
        status={dialogStatus}
        email={dialogEmail}
        password={dialogPassword}
        message={dialogMessage}
        onClose={() => setDialogOpen(false)}
        onDownloadPassword={handleDownloadPassword}
      />
    </Sheet>
  )
}
