"use client"
import React, { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import CustomFormField from "@/components/reusable/CustomFormField"
import { Form } from "@/components/ui/form"
import { FormFieldType } from "@/lib/types"
import { SignupCompleteSchema } from "@/features/auth/schemas/auth.schema"

type Props = {
  onValidityChange?: (valid: boolean) => void
  isPrefilled?: boolean
  prefilledFields?: {
    nombres?: boolean
    apellidos?: boolean
    email?: boolean
    pais?: boolean
    ciudad?: boolean
  }
}

export default function SignupCompleteForm({ 
  onValidityChange, 
  isPrefilled = false, 
  prefilledFields = {} 
}: Props) {
  const form = useFormContext()

  // Debug: log de los valores del formulario (remover en producción)
  console.log("SignupCompleteForm - isPrefilled:", isPrefilled)
  console.log("SignupCompleteForm - form values:", form.getValues())
  console.log("SignupCompleteForm - form values:", form.getValues())

  useEffect(() => {
    if (onValidityChange) {
      const computeValid = () =>
        SignupCompleteSchema.safeParse(form.getValues()).success

      onValidityChange(computeValid())

      const subscription = form.watch(() => {
        onValidityChange(computeValid())
      })
      return () => subscription.unsubscribe()
    }
  }, [form, onValidityChange])

  return (
    <Form {...form}>
      <div className="space-y-4">
        {/* DPI como solo lectura */}
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="dpi"
          label="DPI (CUI)"
          readonly={true}
          description="Este campo no puede ser modificado"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            placeholder="Ingrese su correo"
            name="email"
            label="Email"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            placeholder="Confirme su correo"
            name="confirm_email"
            label="Confirmación de correo"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            placeholder="Ingrese sus nombres"
            name="nombres"
            label="Nombres"
            readonly={prefilledFields.nombres || false}
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            placeholder="Ingrese sus apellidos"
            name="apellidos"
            label="Apellidos"
            readonly={prefilledFields.apellidos || false}
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.PASSWORD}
            placeholder="Ingrese su contraseña"
            name="password"
            label="Contraseña"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.PASSWORD}
            placeholder="Confirme su contraseña"
            name="confirm_password"
            label="Confirmación de contraseña"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            placeholder="País"
            name="pais"
            label="País"
            readonly={prefilledFields.pais || false}
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            placeholder="Ingrese su ciudad"
            name="ciudad"
            label="Ciudad"
            readonly={prefilledFields.ciudad || false}
          />
        </div>
      </div>
    </Form>
  )
}
