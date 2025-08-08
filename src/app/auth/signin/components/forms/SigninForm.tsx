"use client"
import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { SigninSchema } from "@/features/auth/schemas/auth.schema"
import { signin } from "@/features/auth/api/auth.client"
import { Form } from "@/components/ui/form"
import CustomFormField from "@/components/reusable/CustomFormField"
import { FormFieldType } from "@/lib/types"
import { SubmitButton } from "@/components/reusable/SubmitButton"

const SigninForm = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(SigninSchema),
  })

  async function onSubmit(data: z.infer<typeof SigninSchema>) {
    setIsLoading(true)
    console.log(data)
    try {
      const response = await signin(data)
      if (!response.success) {
        toast.error(response.error?.message || "Error al iniciar sesión")
        return
      }

      toast.success("Inicio de sesión exitoso")
      router.push("/dashboard")
    } catch (error) {
      toast.error("Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="email"
          label="Correo electrónico"
          placeholder="Ingrese su correo electrónico"
        />

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.PASSWORD}
          name="password"
          label="Contraseña"
          placeholder="Ingrese su contraseña"
          fieldTypeType="password"
        />

        <SubmitButton isLoading={isLoading} className="w-full">
          Iniciar sesión
        </SubmitButton>
      </form>
    </Form>
  )
}

export default SigninForm
