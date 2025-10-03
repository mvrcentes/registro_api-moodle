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
    primerNombre?: boolean
    segundoNombre?: boolean
    primerApellido?: boolean
    segundoApellido?: boolean
    email?: boolean
    confirm_email?: boolean
    correoInstitucional?: boolean
    correoPersonal?: boolean
    pais?: boolean
    ciudad?: boolean
  }
}

export default function SignupCompleteForm({
  onValidityChange,
  isPrefilled = false,
  prefilledFields = {},
}: Props) {
  const form = useFormContext()

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
            readonly={prefilledFields.email || false}
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            placeholder="Confirme su correo"
            name="confirm_email"
            label="Confirmación de correo"
            readonly={prefilledFields.confirm_email || false}
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            placeholder="Correo institucional"
            name="correoInstitucional"
            label="Correo institucional"
            readonly={prefilledFields.correoInstitucional || false}
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            placeholder="Correo personal"
            name="correoPersonal"
            label="Correo personal"
            readonly={prefilledFields.correoPersonal || false}
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            placeholder="Ingrese su primer nombre"
            name="primerNombre"
            label="Primer Nombre"
            readonly={prefilledFields.primerNombre || false}
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            placeholder="Ingrese su segundo nombre"
            name="segundoNombre"
            label="Segundo Nombre"
            readonly={prefilledFields.segundoNombre || false}
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            placeholder="Ingrese su primer apellido"
            name="primerApellido"
            label="Primer Apellido"
            readonly={prefilledFields.primerApellido || false}
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            placeholder="Ingrese su segundo apellido"
            name="segundoApellido"
            label="Segundo Apellido"
            readonly={prefilledFields.segundoApellido || false}
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
