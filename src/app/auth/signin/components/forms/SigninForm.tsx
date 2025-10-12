"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { SigninInternalSchema } from "@/features/auth/schemas/auth.schema"
import { LocalAuthApi } from "@/features/auth/api/auth.client"
import { parseAxiosError } from "@/lib/api-utils"
import { Form } from "@/components/ui/form"
import CustomFormField from "@/components/reusable/CustomFormField"
import { FormFieldType } from "@/lib/types"
import { SubmitButton } from "@/components/reusable/SubmitButton"

type SigninValues = z.infer<typeof SigninInternalSchema>

const SigninForm = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SigninValues>({
    resolver: zodResolver(SigninInternalSchema),
    defaultValues: {
      email: "admin@registro.local",
      password: "ClaveLarga123!",
    },
  })

  async function onSubmit(data: SigninValues) {
    setIsLoading(true)
    try {
      await LocalAuthApi.login({ email: data.email, password: data.password })
      toast.success("Inicio de sesión exitoso")
      router.replace("/applications")
    } catch (err: unknown) {
      const { message } = parseAxiosError(err)
      toast.error(message)
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
